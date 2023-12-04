import React from "react";
import { useBoolean } from "@worksolutions/react-utils";

export interface GeolocationPositionErrorInterface {
  readonly code: number;
  readonly message: string;
  readonly PERMISSION_DENIED: number;
  readonly POSITION_UNAVAILABLE: number;
  readonly TIMEOUT: number;
}

export interface GeolocationSensorStateInterface {
  loading: boolean;
  coordinates: null | { latitude: number; longitude: number };
  error?: Error | GeolocationPositionErrorInterface;
}

function getInitialState(loading: boolean, coordinates?: GeolocationCoordinates) {
  if (coordinates) return { coordinates, loading };
  return { coordinates: null, loading };
}

export function useGeolocation(options?: PositionOptions) {
  const [enabled, enable, disable] = useBoolean(false);
  const [state, setState] = React.useState<GeolocationSensorStateInterface>(() => getInitialState(false));
  const mountedRef = React.useRef(true);

  const handleCurrentPositionEvent = React.useCallback(({ coords }: GeolocationPosition) => {
    if (!mountedRef.current) return;
    setState(getInitialState(false, coords));
  }, []);

  const handleCurrentPositionErrorEvent = React.useCallback(
    (error: GeolocationPositionErrorInterface) => {
      if (!mountedRef.current) return;
      setState({ ...getInitialState(false), error });
      disable();
    },
    [disable],
  );

  React.useEffect(() => () => void (mountedRef.current = false), []);

  React.useEffect(() => {
    if (!enabled) return;
    setState(getInitialState(true));
    navigator.geolocation.getCurrentPosition(handleCurrentPositionEvent, handleCurrentPositionErrorEvent, options);
  }, [enabled, handleCurrentPositionErrorEvent, handleCurrentPositionEvent, options]);

  const handleEnable = React.useCallback(() => {
    if (state.loading) return;
    disable();
    const timer = setTimeout(enable, 1);
    return () => clearTimeout(timer);
  }, [disable, enable, state.loading]);

  return [state, handleEnable, disable] as const;
}

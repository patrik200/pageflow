import React from "react";
import { observer } from "mobx-react-lite";
import { useTranslation, useViewContext } from "@app/front-kit";
import { Button } from "@app/ui-kit";
import { useAsyncFn, useFileSelector } from "@worksolutions/react-utils";
import { AcceptTypes, FileInterface } from "@worksolutions/utils";

import Logo from "components/Logo";

import { emitRequestError, emitRequestErrorFiles } from "core/emitRequest";

import { ClientCommonStorage } from "core/storages/client/client-common";

import { imageStyles, imageWrapperStyles, wrapperStyles } from "./style.css";

function LogoView() {
  const { t } = useTranslation("settings");
  const { client, currentClientUploadLogo, currentClientDeleteLogo } =
    useViewContext().containerInstance.get(ClientCommonStorage);

  const [{ loading: uploadLoading }, asyncUploadLogo] = useAsyncFn(currentClientUploadLogo, [currentClientUploadLogo]);
  const [{ loading: deleteLoading }, asyncDeleteLogo] = useAsyncFn(currentClientDeleteLogo, [currentClientDeleteLogo]);

  const handleUploadLogo = React.useCallback(
    async (file: FileInterface) => {
      const result = await asyncUploadLogo(file);
      if (result.success) {
        emitRequestErrorFiles({ uploadResults: [result.uploadResult] }, t);
        return;
      }

      emitRequestError(
        undefined,
        result.error,
        t({ scope: "tab_client", place: "logo", name: "error_messages", parameter: "replace_unexpected" }),
      );
    },
    [asyncUploadLogo, t],
  );

  const { openNativeFileDialog, dropAreaProps } = useFileSelector(
    handleUploadLogo,
    React.useMemo(() => ({ multiply: false, acceptTypes: [AcceptTypes.IMAGE] }), []),
  );

  const handleDeleteLogo = React.useCallback(async () => {
    const result = await asyncDeleteLogo();
    if (result.success) return;

    emitRequestError(
      undefined,
      result.error,
      t({ scope: "tab_client", place: "logo", name: "error_messages", parameter: "delete_unexpected" }),
    );
  }, [asyncDeleteLogo, t]);

  return (
    <div {...dropAreaProps} className={wrapperStyles}>
      <Logo className={imageWrapperStyles} logoClassName={imageStyles} />
      {client.logo && (
        <Button iconLeft="pencilLine" type="OUTLINE" loading={uploadLoading} onClick={openNativeFileDialog}>
          {t({ scope: "tab_client", place: "logo", name: "replace_action" })}
        </Button>
      )}
      {client.logo && (
        <Button type="OUTLINE" loading={deleteLoading} onClick={handleDeleteLogo}>
          {t({ scope: "tab_client", place: "logo", name: "delete_action" })}
        </Button>
      )}
      {!client.logo && (
        <Button iconLeft="plusLine" type="OUTLINE" loading={uploadLoading} onClick={openNativeFileDialog}>
          {t({ scope: "tab_client", place: "logo", name: "create_action" })}
        </Button>
      )}
    </div>
  );
}

export default observer(LogoView);

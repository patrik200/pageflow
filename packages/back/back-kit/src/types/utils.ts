export type TrimDash<Text extends string> = Text extends `-${infer Rest}` ? Rest : Text;

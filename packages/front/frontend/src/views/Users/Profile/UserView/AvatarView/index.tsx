import React from "react";
import { observer } from "mobx-react-lite";
import { Image, useTranslation, useViewContext } from "@app/front-kit";
import { Button, Icon } from "@app/ui-kit";
import { useAsyncFn, useFileSelector } from "@worksolutions/react-utils";
import { AcceptTypes, FileInterface } from "@worksolutions/utils";

import { emitRequestError, emitRequestErrorFiles } from "core/emitRequest";

import { UserEntity } from "core/entities/user";

import { UserDetailStorage } from "core/storages/user/userDetail";

import { emptyImageIconStyles, emptyImageStyles, imageStyles, wrapperStyles } from "./style.css";

interface AvatarViewInterface {
  user: UserEntity;
}

function AvatarView({ user }: AvatarViewInterface) {
  const { t } = useTranslation("user-profile");
  const { containerInstance } = useViewContext();
  const { uploadAvatar, deleteAvatar } = containerInstance.get(UserDetailStorage);
  const [{ loading: uploadLoading }, asyncUploadAvatar] = useAsyncFn(uploadAvatar, [uploadAvatar]);
  const [{ loading: deleteLoading }, asyncDeleteAvatar] = useAsyncFn(deleteAvatar, [deleteAvatar]);

  const handleUploadAvatar = React.useCallback(
    async (file: FileInterface) => {
      const result = await asyncUploadAvatar(user.id, file);
      if (result.success) {
        emitRequestErrorFiles({ uploadResults: [result.uploadResult] }, t);
        return;
      }

      emitRequestError(
        undefined,
        result.error,
        t({ scope: "tab_user", place: "avatar_block", name: "error_messages", parameter: "replace_unexpected" }),
      );
    },
    [asyncUploadAvatar, t, user.id],
  );

  const { openNativeFileDialog, dropAreaProps } = useFileSelector(
    handleUploadAvatar,
    React.useMemo(() => ({ multiply: false, acceptTypes: [AcceptTypes.IMAGE] }), []),
  );

  const handleDeleteAvatar = React.useCallback(async () => {
    const result = await asyncDeleteAvatar(user.id);
    if (result.success) return;

    emitRequestError(
      undefined,
      result.error,
      t({ scope: "tab_user", place: "avatar_block", name: "error_messages", parameter: "delete_unexpected" }),
    );
  }, [asyncDeleteAvatar, t, user.id]);

  return (
    <div {...dropAreaProps} className={wrapperStyles}>
      {user.avatar ? (
        <Image className={imageStyles} src={user.avatar.url} />
      ) : (
        <div className={emptyImageStyles}>
          <Icon className={emptyImageIconStyles} icon="userLine" />
        </div>
      )}
      {user.canUpdate && (
        <>
          {user.avatar && (
            <Button iconLeft="pencilLine" type="OUTLINE" loading={uploadLoading} onClick={openNativeFileDialog}>
              {t({ scope: "tab_user", place: "avatar_block", name: "replace_avatar_action" })}
            </Button>
          )}
          {user.avatar && (
            <Button type="OUTLINE" loading={deleteLoading} onClick={handleDeleteAvatar}>
              {t({ scope: "tab_user", place: "avatar_block", name: "delete_avatar_action" })}
            </Button>
          )}
          {!user.avatar && (
            <Button iconLeft="plusLine" type="OUTLINE" loading={uploadLoading} onClick={openNativeFileDialog}>
              {t({ scope: "tab_user", place: "avatar_block", name: "create_avatar_action" })}
            </Button>
          )}
        </>
      )}
    </div>
  );
}

export default observer(AvatarView);

import { observer } from "mobx-react-lite";
import { useBoolean } from "@worksolutions/react-utils";
import { Drawer, Button, Icon } from "@app/ui-kit";

import MenuLinks from "./Links";
import MenuLogo from "./Logo";
import MenuUser from "./User";

import { mobileBurgerButtonStyles, menuWrapperMobileStyles, menuWrapperDesktopStyles } from "./style.css";

function PageWrapperMenu() {
  const [isDrawerOpened, openDrawer, closeDrawer] = useBoolean(false);

  return (
    <>
      <div className={menuWrapperDesktopStyles}>
        <MenuLogo />
        <MenuLinks />
        <MenuUser />
      </div>
      <Button className={mobileBurgerButtonStyles} onClick={openDrawer} type="WITHOUT_BORDER">
        <Icon icon="menuLine" />
      </Button>
      <Drawer appearancePosition="left" opened={isDrawerOpened} onClose={closeDrawer}>
        <div className={menuWrapperMobileStyles}>
          <MenuLinks />
          <MenuUser />
        </div>
      </Drawer>
    </>
  );
}

export default observer(PageWrapperMenu);

import React from "react";
import { useToggle } from "@worksolutions/react-utils";

import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableHeadCellAvailableOrder,
  TableRow,
  Typography,
} from "main";

import { buttonStyles, textStyles, wrapperStyles } from "./style.css";

export function TableDemo() {
  const [order, setOrder] = React.useState<TableHeadCellAvailableOrder>(null);
  const [loading, toggleLoading] = useToggle(false);

  return (
    <div className={wrapperStyles}>
      <Button className={buttonStyles} size="SMALL" onClick={toggleLoading}>
        toggle loading
      </Button>
      <Table loading={loading}>
        <TableHead>
          <TableRow>
            <TableHeadCell onChangeOrder={setOrder}>ORDER</TableHeadCell>
            <TableHeadCell position="center" onChangeOrder={setOrder}>
              TOTAL
            </TableHeadCell>
            <TableHeadCell>COURIER</TableHeadCell>
            <TableHeadCell position="right" order={order} onChangeOrder={setOrder}>
              TIME
            </TableHeadCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow href="https://yandex.ru" target="_blank">
            <TableCell>
              <Typography className={textStyles}>One</Typography>
            </TableCell>
            <TableCell position="center">
              <Typography className={textStyles}>two1231231231231231231231231231232</Typography>
            </TableCell>
            <TableCell>
              <Typography className={textStyles}>three</Typography>
            </TableCell>
            <TableCell position="right">
              <Typography className={textStyles}>four</Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <Typography className={textStyles}>One</Typography>
            </TableCell>
            <TableCell>
              <Typography className={textStyles}>two</Typography>
            </TableCell>
            <TableCell>
              <Typography className={textStyles}>three</Typography>
            </TableCell>
            <TableCell position="right">
              <Typography className={textStyles}>four</Typography>
            </TableCell>
          </TableRow>
        </TableBody>
        <TableBody>
          <TableRow hoverable>
            <TableCell>
              <Typography className={textStyles}>One</Typography>
            </TableCell>
            <TableCell>
              <Typography className={textStyles}>two</Typography>
            </TableCell>
            <TableCell>
              <Typography className={textStyles}>three</Typography>
            </TableCell>
            <TableCell position="right">
              <Typography className={textStyles}>four</Typography>
            </TableCell>
          </TableRow>
          <TableRow hoverable onClick={console.log}>
            <TableCell>
              <Typography className={textStyles}>One</Typography>
            </TableCell>
            <TableCell>
              <Typography className={textStyles}>two</Typography>
            </TableCell>
            <TableCell>
              <Typography className={textStyles}>three</Typography>
            </TableCell>
            <TableCell position="right">
              <Typography className={textStyles}>four</Typography>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}

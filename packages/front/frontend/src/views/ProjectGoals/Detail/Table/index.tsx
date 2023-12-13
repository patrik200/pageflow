import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableCellDefaultText,
  TableHead,
  TableHeadCell,
  TableRow,
  typographyOptionalStyleVariants,
} from "@app/ui-kit";
import { observer } from "mobx-react-lite";

interface TimePointsTableInterface {
  goal: any;
}

function TimePointsTable({ goal }: TimePointsTableInterface) {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableHeadCell>Номер</TableHeadCell>
          <TableHeadCell>Название</TableHeadCell>
          <TableHeadCell>Описание</TableHeadCell>
          <TableHeadCell>Дата начала план</TableHeadCell>
          <TableHeadCell>Дата факт</TableHeadCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {goal.timepoints.map((timepoint, index) => (
          <TableRow key={index}>
            <TableCell>
              <TableCellDefaultText className={typographyOptionalStyleVariants.noWrap}>
                {index + 1}
              </TableCellDefaultText>
            </TableCell>
            <TableCell>
              <TableCellDefaultText className={typographyOptionalStyleVariants.noWrap}>
                {timepoint.name}
              </TableCellDefaultText>
            </TableCell>
            <TableCell>
              <TableCellDefaultText className={typographyOptionalStyleVariants.noWrap}>
                {timepoint.description}
              </TableCellDefaultText>
            </TableCell>
          </TableRow>
        ))}
        <TableRow>
          <Button type="WITHOUT_BORDER" iconLeft="plusLine">
            Добавить точку
          </Button>
        </TableRow>
      </TableBody>
    </Table>
  );
}

export default observer(TimePointsTable);

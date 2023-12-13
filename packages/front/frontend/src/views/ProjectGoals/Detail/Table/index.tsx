import { useTranslation } from "@app/front-kit";
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
  const { t }  = useTranslation("goal-detail");
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableHeadCell>{t({ scope: "time_point_tab", name: "number_field", parameter: "placeholder" })}</TableHeadCell>
          <TableHeadCell>{t({ scope: "time_point_tab", name: "name_field", parameter: "placeholder" })}</TableHeadCell>
          <TableHeadCell>{t({ scope: "time_point_tab", name: "description_field", parameter: "placeholder" })}</TableHeadCell>
          <TableHeadCell>{t({ scope: "time_point_tab", name: "data_plan_field", parameter: "placeholder" })}</TableHeadCell>
          <TableHeadCell>{t({ scope: "time_point_tab", name: "data_fact_field", parameter: "placeholder" })}</TableHeadCell>
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

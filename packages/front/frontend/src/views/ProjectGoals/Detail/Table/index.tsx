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
  useCollapse,
} from "@app/ui-kit";
import { observer } from "mobx-react-lite";
import { useBoolean } from "@worksolutions/react-utils";
import EditTimepointModal from "views/ProjectGoals/Modals/EditTimepoint";
import { hidenWrapperStyles, wrapperStyles } from "./style.css";

interface TimePointsTableInterface {
  goal: any;
  opened: boolean;
}

function TimePointsTable({ goal, opened }: TimePointsTableInterface) {
  const { t } = useTranslation("goal-detail");
  const [modalOpened, onOpen, onClose] = useBoolean(false);

  const { initRef, style } = useCollapse(opened);

  return (
    <div ref={initRef} style={style} className={opened ? wrapperStyles : hidenWrapperStyles}>
      <Table>
        <TableHead>
          <TableRow>
            <TableHeadCell>
              {t({ scope: "time_point_tab", name: "number_field", parameter: "placeholder" })}
            </TableHeadCell>
            <TableHeadCell>
              {t({ scope: "time_point_tab", name: "name_field", parameter: "placeholder" })}
            </TableHeadCell>
            <TableHeadCell>
              {t({ scope: "time_point_tab", name: "description_field", parameter: "placeholder" })}
            </TableHeadCell>
            <TableHeadCell>
              {t({ scope: "time_point_tab", name: "date_plan_field", parameter: "placeholder" })}
            </TableHeadCell>
            <TableHeadCell>
              {t({ scope: "time_point_tab", name: "date_fact_field", parameter: "placeholder" })}
            </TableHeadCell>
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
              <TableCell>
                <TableCellDefaultText className={typographyOptionalStyleVariants.noWrap}>
                  {timepoint.viewStartDatePlan}
                </TableCellDefaultText>
              </TableCell>
              <TableCell>
                <TableCellDefaultText className={typographyOptionalStyleVariants.noWrap}>
                  {timepoint.viewStartDateFact}
                </TableCellDefaultText>
              </TableCell>
            </TableRow>
          ))}
          <TableRow>
            <Button type="WITHOUT_BORDER" iconLeft="plusLine" onClick={onOpen}>
              {t({ scope: "time_point_tab", place: "actions", name: "create" })}
            </Button>
          </TableRow>
        </TableBody>
      </Table>
      <EditTimepointModal goalId={goal.id} opened={modalOpened} close={onClose} />
    </div>
  );
}

export default observer(TimePointsTable);

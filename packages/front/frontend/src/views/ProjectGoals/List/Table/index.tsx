import { useTranslation, useViewContext } from "@app/front-kit";
import {
    Table,
    TableBody,
    TableCell,
    TableCellDefaultText,
    TableHead,
    TableHeadCell,
    TableRow,
    typographyOptionalStyleVariants,
} from "@app/ui-kit";
import { GoalEntity } from "core/entities/goal/goal";
import { GoalStorage } from "core/storages/goal";
import { observer } from "mobx-react-lite"

interface GoalsTableInterface{
  goals: GoalEntity[]
} 

function GoalsTable({goals}: GoalsTableInterface) {
    const { t } = useTranslation("goal-list");
    return <Table>
        <TableHead>
            <TableRow>
                <TableHeadCell>{t({ scope: "table", place: "header", name: "name" })}</TableHeadCell>
                <TableHeadCell>{t({ scope: "table", place: "header", name: "description" })}</TableHeadCell>
                <TableHeadCell>{t({ scope: "table", place: "header", name: "implemented" })}</TableHeadCell>
            </TableRow>
        </TableHead>
        <TableBody>
            {goals.map((goal) => <TableRow key={goal.id} href={`/goals/${goal.id}`}>
            <TableCell>
              <TableCellDefaultText className={typographyOptionalStyleVariants.noWrap}>
                {goal.name}
              </TableCellDefaultText>
            </TableCell>
            <TableCell>
              <TableCellDefaultText className={typographyOptionalStyleVariants.noWrap}>
                {goal.description}
              </TableCellDefaultText>
            </TableCell>
            <TableCell>
              <TableCellDefaultText className={typographyOptionalStyleVariants.noWrap}>
                {t({scope: "implemented", name: goal.implemented == true ? "true" : "false"})}
              </TableCellDefaultText>
            </TableCell>
            
          </TableRow>
        )}
      </TableBody>
    </Table>
}

export default observer(GoalsTable)
import { observer } from "mobx-react-lite";

import Relations from "../../../../Relations";

function TicketRelations() {
  return <Relations edit={false} />;
}

export default observer(TicketRelations);

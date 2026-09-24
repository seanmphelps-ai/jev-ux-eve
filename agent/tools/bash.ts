import { defineTool } from "eve/tools";
import { bash } from "eve/tools/bash";
import { commandApproval } from "../lib/command-approval";

export default defineTool({
  ...bash,
  approval: commandApproval(),
});

import { Body, Controller, Get, Param, Patch, Post } from "@nestjs/common";
import { RequirePermissions } from "../../common/auth/permissions.decorator";
import { CreateExpenseDto, DecideExpenseDto } from "./dto/expense.dto";
import { ExpensesService } from "./expenses.service";

@Controller("expenses")
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Get()
  @RequirePermissions("expenses.read")
  list() {
    return this.expensesService.list();
  }

  @Post()
  @RequirePermissions("expenses.create")
  create(@Body() body: CreateExpenseDto) {
    return this.expensesService.create(body);
  }

  @Patch(":id/manager-approve")
  @RequirePermissions("expenses.approve")
  managerApprove(@Param("id") id: string, @Body() body: DecideExpenseDto) {
    return this.expensesService.managerApprove(id, body);
  }

  @Patch(":id/hr-approve")
  @RequirePermissions("expenses.approve")
  hrApprove(@Param("id") id: string, @Body() body: DecideExpenseDto) {
    return this.expensesService.hrApprove(id, body);
  }

  @Patch(":id/reject")
  @RequirePermissions("expenses.approve")
  reject(@Param("id") id: string, @Body() body: DecideExpenseDto) {
    return this.expensesService.reject(id, body);
  }

  @Patch(":id/reimburse")
  @RequirePermissions("expenses.update")
  reimburse(@Param("id") id: string, @Body() body: DecideExpenseDto) {
    return this.expensesService.reimburse(id, body);
  }
}

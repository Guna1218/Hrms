import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { RequirePermissions } from "../../common/auth/permissions.decorator";
import { PayrollService } from "./payroll.service";
import { CreatePayrollRunDto, CreateSalaryStructureDto } from "./dto/payroll.dto";

@Controller("payroll")
export class PayrollController {
  constructor(private readonly payrollService: PayrollService) {}

  @Get("salary-structures")
  @RequirePermissions("payroll.read")
  salaryStructures() {
    return this.payrollService.salaryStructures();
  }

  @Post("salary-structures")
  @RequirePermissions("payroll.configure")
  createSalaryStructure(@Body() body: CreateSalaryStructureDto) {
    return this.payrollService.createSalaryStructure(body);
  }

  @Get("runs")
  @RequirePermissions("payroll.read")
  runs() {
    return this.payrollService.runs();
  }

  @Post("runs")
  @RequirePermissions("payroll.create")
  createRun(@Body() body: CreatePayrollRunDto) {
    return this.payrollService.createRun(body);
  }

  @Post("runs/:id/calculate")
  @RequirePermissions("payroll.update")
  calculate(@Param("id") id: string) {
    return this.payrollService.calculate(id);
  }

  @Post("runs/:id/lock")
  @RequirePermissions("payroll.approve")
  lock(@Param("id") id: string) {
    return this.payrollService.lock(id);
  }

  @Get("runs/:id/payslips")
  @RequirePermissions("payroll.read")
  payslips(@Param("id") id: string) {
    return this.payrollService.payslips(id);
  }

  @Post("runs/:id/bank-export")
  @RequirePermissions("payroll.export")
  bankExport(@Param("id") id: string) {
    return this.payrollService.bankExport(id);
  }
}

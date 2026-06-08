import { Body, Controller, Get, Param, Patch, Post } from "@nestjs/common";
import { RequirePermissions } from "../../common/auth/permissions.decorator";
import { AttendanceService } from "./attendance.service";
import { CheckInDto, CheckOutDto, DecideAttendanceDto, OvertimeDto, RegularizationDto } from "./dto/attendance.dto";

@Controller("attendance")
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Get("logs")
  @RequirePermissions("attendance.read")
  logs() {
    return this.attendanceService.logs();
  }

  @Post("check-in")
  @RequirePermissions("attendance.create")
  checkIn(@Body() body: CheckInDto) {
    return this.attendanceService.checkIn(body);
  }

  @Post("check-out")
  @RequirePermissions("attendance.create")
  checkOut(@Body() body: CheckOutDto) {
    return this.attendanceService.checkOut(body);
  }

  @Get("shifts")
  @RequirePermissions("attendance.read")
  shifts() {
    return this.attendanceService.shifts();
  }

  @Get("regularizations")
  @RequirePermissions("attendance.read")
  regularizations() {
    return this.attendanceService.regularizations();
  }

  @Post("regularizations")
  @RequirePermissions("attendance.update")
  regularize(@Body() body: RegularizationDto) {
    return this.attendanceService.regularize(body);
  }

  @Patch("regularizations/:id/approve")
  @RequirePermissions("attendance.approve")
  approveRegularization(@Param("id") id: string, @Body() body: DecideAttendanceDto) {
    return this.attendanceService.approveRegularization(id, body);
  }

  @Post("overtime")
  @RequirePermissions("attendance.update")
  overtime(@Body() body: OvertimeDto) {
    return this.attendanceService.overtime(body);
  }
}

import { Body, Controller, Get, Param, Patch, Post } from "@nestjs/common";
import { RequirePermissions } from "../../common/auth/permissions.decorator";
import { CreateHolidayDto, UpdateHolidayStatusDto } from "./dto/holiday.dto";
import { HolidaysService } from "./holidays.service";

@Controller("holidays")
export class HolidaysController {
  constructor(private readonly holidaysService: HolidaysService) {}

  @Get()
  @RequirePermissions("holidays.read")
  list() {
    return this.holidaysService.list();
  }

  @Post()
  @RequirePermissions("holidays.create")
  create(@Body() body: CreateHolidayDto) {
    return this.holidaysService.create(body);
  }

  @Patch(":id/status")
  @RequirePermissions("holidays.update")
  updateStatus(@Param("id") id: string, @Body() body: UpdateHolidayStatusDto) {
    return this.holidaysService.updateStatus(id, body);
  }
}

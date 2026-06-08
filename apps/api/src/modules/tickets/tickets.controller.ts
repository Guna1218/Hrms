import { Body, Controller, Get, Param, Patch, Post } from "@nestjs/common";
import { TicketsService } from "./tickets.service";
import { CurrentUser } from "../../common/auth/current-user.decorator";
import { AuthenticatedUser } from "../../common/auth/auth.types";
import { CreateTicketDto } from "./dto/create-ticket.dto";
import { CreateCommentDto } from "./dto/create-comment.dto";

@Controller("tickets")
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Post()
  create(@CurrentUser() user: AuthenticatedUser, @Body() dto: CreateTicketDto) {
    return this.ticketsService.create(user, dto);
  }

  @Get()
  findAll(@CurrentUser() user: AuthenticatedUser) {
    return this.ticketsService.findAll(user);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.ticketsService.findOne(id);
  }

  @Post(":id/comments")
  addComment(
    @CurrentUser() user: AuthenticatedUser,
    @Param("id") id: string,
    @Body() dto: CreateCommentDto,
  ) {
    return this.ticketsService.addComment(user, id, dto);
  }

  @Patch(":id/status")
  updateStatus(
    @CurrentUser() user: AuthenticatedUser,
    @Param("id") id: string,
    @Body("status") status: string,
  ) {
    return this.ticketsService.updateStatus(user, id, status);
  }
}

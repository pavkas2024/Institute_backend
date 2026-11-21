
import {
    Controller,
    Get,
    Post,
    Patch,
    Body,
  } from "@nestjs/common";
  import {
    ApiTags,
    ApiOperation,
    ApiResponse,
  } from "@nestjs/swagger";
  
  import { CkknoService } from "./ckkno.service";
  import {
    CreateCkknoInfoDto,
    UpdateCkknoInfoDto,
  } from "./dto/ckkno-info.dto";
  
  @ApiTags("CKKNO")
  @Controller("ckkno")
  export class CkknoController {
    constructor(
      private readonly ckknoService: CkknoService,
    ) {}
  
    @Get("info")
    @ApiOperation({
      summary: "Отримати інформацію про ЦККНО",
    })
    @ApiResponse({
      status: 200,
      description: "Інформація про Центр",
    })
    getInfo() {
      return this.ckknoService.getInfo();
    }
  
    @Post("info")
    @ApiOperation({
      summary: "Створити інформацію про ЦККНО",
    })
    @ApiResponse({
      status: 201,
      description: "Інформацію успішно створено",
    })
    createInfo(@Body() dto: CreateCkknoInfoDto) {
      return this.ckknoService.createInfo(dto);
    }
  
    @Patch("info")
    @ApiOperation({
      summary: "Оновити окремі поля інформації про ЦККНО",
    })
    @ApiResponse({
      status: 200,
      description: "Інформацію успішно оновлено",
    })
    updateInfo(@Body() dto: UpdateCkknoInfoDto) {
      return this.ckknoService.updateInfo(dto);
    }
  }
  
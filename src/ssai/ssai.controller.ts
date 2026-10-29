
import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  BadRequestException, 
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';

import {
  ApiTags,
  ApiOperation,
} from '@nestjs/swagger';

import { SsaiService } from './ssai.service';

import { CreateSsaiInfoDto } from './dto/create-ssai-info.dto';
import { UpdateSsaiInfoDto } from './dto/update-ssai-info.dto';

import { CreateSsaiSessionDto } from './dto/create-ssai-session.dto';
import { UpdateSsaiSessionDto } from './dto/update-ssai-session.dto';

@ApiTags('SSAI')
@Controller('ssai')
export class SsaiController {
  constructor(
    private readonly ssaiService: SsaiService,
  ) {}

  // Загальна інформація про семінар

  @Get('info')
  @ApiOperation({ summary: 'Get SSAI seminar information' })
  getInfo() {
    return this.ssaiService.getInfo();
  }

  @Post('info')
  @ApiOperation({ summary: 'Create SSAI seminar information' })
  createInfo(@Body() data: CreateSsaiInfoDto) {
    return this.ssaiService.createInfo(data);
  }

  @Patch('info')
  @ApiOperation({ summary: 'Update SSAI seminar information' })
  updateInfo(@Body() data: UpdateSsaiInfoDto) {
    return this.ssaiService.updateInfo(data);
  }


  @Delete('info')
  @ApiOperation({ summary: 'Delete SSAI seminar information' })
  deleteInfo() {
    return this.ssaiService.deleteInfo();
  }


  // Засідання семінару

  
 
  @Get('sessions')
  @ApiOperation({ summary: 'Get SSAI sessions with pagination' })
  getSessions(
    @Query('completed') completed: string = 'false',
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    const pageNumber = Number(page);
    const limitNumber = Number(limit);

    if (
      !Number.isInteger(pageNumber) ||
      pageNumber < 1 ||
      !Number.isInteger(limitNumber) ||
      limitNumber < 1
    ) {
      throw new BadRequestException(
        'Page and limit must be positive integers',
      );
    }

    return this.ssaiService.getSessions(
      completed === 'true',
      pageNumber,
      limitNumber,
    );
  }



  @Get('sessions/:id')
  @ApiOperation({ summary: 'Get SSAI session by ID' })
  getSessionById(@Param('id') id: string) {
    return this.ssaiService.getSessionById(id);
  }

  @Post('sessions')
  @ApiOperation({ summary: 'Create SSAI session' })
  createSession(@Body() data: CreateSsaiSessionDto) {
    return this.ssaiService.createSession(data);
  }

  @Patch('sessions/:id')
  @ApiOperation({ summary: 'Update SSAI session' })
  updateSession(
    @Param('id') id: string,
    @Body() data: UpdateSsaiSessionDto,
  ) {
    return this.ssaiService.updateSession(id, data);
  }

  @Delete('sessions/:id')
  @ApiOperation({ summary: 'Delete SSAI session' })
  deleteSession(@Param('id') id: string) {
    return this.ssaiService.deleteSession(id);
  }
}

import { 
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    UseGuards,
    UseInterceptors,
    HttpStatus,
    BadRequestException, 
} from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import {
    ApiTags,
    ApiOperation,
    ApiConsumes,
    ApiResponse,
    ApiParam,
} from '@nestjs/swagger';

import { DepartmentsService } from './departments.service';
import { Department } from './schemas/departments.schema';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';

@ApiTags('Departments')
@Controller('departments')
export class DepartmentsController {
    
    constructor(
        private departmentsService: DepartmentsService,
    ) {}

    /////////////////////////////////////////////////////    
    @Get()
        async getAllContacts(): Promise<Department[]> {

        return this.departmentsService.getAll();
    }
/////////////////////////////////////////////////////   
    @Post()
    @ApiOperation({ summary: 'Add department' })
    @ApiConsumes('multipart/form-data', 'application/json')
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Department created',
        type: CreateDepartmentDto,
    })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
    @UseInterceptors(AnyFilesInterceptor()) 
    async createDepartment(
        @Body()
        body: any
    ): Promise<Department> {

  // ✅ Спроба парсити translates
  try {
    if (typeof body.translates === 'string') {
      body.translates = JSON.parse(body.translates);
    }
  } catch (e) {
    throw new BadRequestException('Invalid translates JSON');
  }

  // ✅ Перевірка на обовʼязкові поля
  const required = ['translates'];
  for (const key of required) {
    if (!body[key]) {
      throw new BadRequestException(`Field '${key}' is required`);
    }
  }

        const data = {
            ...body,
        };
        
        return this.departmentsService.create(data);
    }
//////////////////////////////////
    @Get(':id')
    @ApiOperation({ summary: 'Get department by ID' })
    @ApiParam({ name: 'id', required: true, description: 'Department ID' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Department found', type: Department })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Department not found' })
    async getDepartment(
        @Param('id') 
        id: string,
    ): Promise<Department> {
        return this.departmentsService.getById(id);
    }

///////////////////////////
    @Patch(':id')
    @ApiOperation({ summary: 'Update department by ID (partial update)' })
    @ApiParam({ name: 'id', required: true, description: 'Department ID' })
    @ApiConsumes('multipart/form-data', 'application/json')
    @ApiResponse({ status: HttpStatus.OK, description: 'Department updated', type: UpdateDepartmentDto })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Department not found' })
    @UseInterceptors(AnyFilesInterceptor()) 
    async updateDepartment(
        @Param('id') id: string, 
        @Body() body: any,
    ): Promise<Department> {
        if (typeof body.translates === 'string') {
            try {
                body.translates = JSON.parse(body.translates);
            } catch {
            throw new BadRequestException('Invalid JSON in translates field');
            }
        }

        return this.departmentsService.updateById(id, body);
    }

/////////////////////

    @Delete(':id')
    @ApiOperation({ summary: 'Delete department by ID' })
    @ApiParam({ name: 'id', required: true, description: 'Department ID' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Department deleted', type: Department })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Department not found' })
    async deleteDepartment(
        @Param('id') 
        id: string,
    ): Promise<Department> {
    return this.departmentsService.deleteById(id);
    }




















}

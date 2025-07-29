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

import { ContactsService } from './contacts.service';
import { Contact } from './schemas/contacts.schema';

@ApiTags('Contacts')
@Controller('contacts')
export class ContactsController {

    constructor(
        private contactsService: ContactsService,
    ) {}
/////////////////////////////////////////////////////    
    @Get()
        async getAllContacts(): Promise<Contact[]> {

        return this.contactsService.getAll();
    }
/////////////////////////////////////////////////////   
    @Post()
    @ApiOperation({ summary: 'Add contact' })
    @ApiConsumes('multipart/form-data', 'application/json')
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Contact created',
        type: 'Contact',
    })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
    @UseInterceptors(AnyFilesInterceptor()) 
    async createContact(
        @Body()
        body: any
    ): Promise<Contact> {

  // ✅ Спроба парсити translates
  try {
    if (typeof body.translates === 'string') {
      body.translates = JSON.parse(body.translates);
    }
  } catch (e) {
    throw new BadRequestException('Invalid translates JSON');
  }

  // ✅ Перевірка на обовʼязкові поля
  const required = ['build', 'indexPost', 'email', 'phone', 'translates'];
  for (const key of required) {
    if (!body[key]) {
      throw new BadRequestException(`Field '${key}' is required`);
    }
  }

        const data = {
            ...body,
        };
        
        return this.contactsService.create(data);
    }
//////////////////////////////////
    @Get(':id')
    @ApiOperation({ summary: 'Get contact by ID' })
    @ApiParam({ name: 'id', required: true, description: 'Contact ID' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Contact found', type: Contact })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Contact not found' })
    async getContact(
        @Param('id') 
        id: string,
    ): Promise<Contact> {
        return this.contactsService.getById(id);
    }

///////////////////////////
    @Patch(':id')
    @ApiOperation({ summary: 'Update contact by ID (partial update)' })
    @ApiParam({ name: 'id', required: true, description: 'Contact ID' })
    @ApiConsumes('multipart/form-data', 'application/json')
    @ApiResponse({ status: HttpStatus.OK, description: 'Contact updated', type: Contact })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Contact not found' })
    @UseInterceptors(AnyFilesInterceptor()) 
    async updateContact(
        @Param('id') id: string, 
        @Body() body: any,
    ): Promise<Contact> {
        if (typeof body.translates === 'string') {
            try {
                body.translates = JSON.parse(body.translates);
            } catch {
            throw new BadRequestException('Invalid JSON in translates field');
            }
        }

        return this.contactsService.updateById(id, body);
    }

/////////////////////

    @Delete(':id')
    @ApiOperation({ summary: 'Delete contact by ID' })
    @ApiParam({ name: 'id', required: true, description: 'Contact ID' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Contact deleted', type: Contact })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Contact not found' })
    async deleteContact(
        @Param('id') 
        id: string,
    ): Promise<Contact> {
    return this.contactsService.deleteById(id);
    }
}

import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, UseInterceptors, UploadedFile, Query, ParseIntPipe } from '@nestjs/common';
import { PhonebookService } from './phonebook.service';
import { CreatePhonebookDto } from './dto/create-phonebook.dto';
import { UpdatePhonebookDto } from './dto/update-phonebook.dto';
import { AuthGuard } from 'src/guards/auth.guards';
import { FileInterceptor } from '@nestjs/platform-express';
import { v4 as uuid } from 'uuid';
import { extname } from 'path';
import { diskStorage } from 'multer';
import { UpdateBookmarkDto } from './dto/update-bookmark.dto';
import { Label } from '@prisma/client';
 
const fileConfig = {
  destination: './files/avatar',
  filename: (req, file, cb) => {
    const uniqueSuffix = uuid();
    const fileExt = extname(file.originalname);
    const fileName = uniqueSuffix + fileExt;
    cb(null, fileName);
  }
}

@Controller('phonebook')
@UseGuards(AuthGuard )
export class PhonebookController {
  constructor(private readonly phonebookService: PhonebookService) {}

  @Post('create')
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: diskStorage(fileConfig)
    })
  )
  public async createContact(
    @Body() createPhonebookDto: CreatePhonebookDto,
    @Req() { user },
    @UploadedFile() avatar: Express.Multer.File,
  ) {
    return this.phonebookService.createContact(createPhonebookDto, user, avatar);
  }

  @Post('update/:id')
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: diskStorage(fileConfig)
    })
  )
  public async updateContact(
    @Body() updatePhonebookDto: UpdatePhonebookDto,
    @Req() { user },
    @UploadedFile() avatar: Express.Multer.File,
    @Param('id', ParseIntPipe) id: number
  ){
    return this.phonebookService.updateContact(updatePhonebookDto, user, avatar, id);
  }

  @Get()
  findAll(
    @Req() { user },
    @Query('skip', ParseIntPipe) skip: number,
    @Query('q') q: string,
    @Query('filterBy') filterBy: Label
  ) {
    return this.phonebookService.findAll( user, skip, q, filterBy );
  }

  @Patch('bookmark/:id')
  public async updateBookmark(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateBookmarkDto: UpdateBookmarkDto,
    @Req() { user }
  ) {
    return this.phonebookService.updateBookmark(id, updateBookmarkDto, user);
  } 

  @Delete(':id')
  public async removeContact(
    @Param('id', ParseIntPipe) id: number,
    @Req() { user }
  ) {
    return this.phonebookService.removeContact(id, user);
  }

  @Get('getone/:id')
  public async getOneContact(
    @Param('id', ParseIntPipe) id: number,
    @Req() { user }
  ){
    return this.phonebookService.getOneContact(id, user);
  }
}

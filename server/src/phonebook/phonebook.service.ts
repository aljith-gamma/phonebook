import { Injectable } from '@nestjs/common';
import { CreatePhonebookDto } from './dto/create-phonebook.dto';
import { UpdatePhonebookDto } from './dto/update-phonebook.dto';
import { Label, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { normalize } from 'node:path';
import { ADDRGETNETWORKPARAMS } from 'node:dns';
import { UpdateBookmarkDto } from './dto/update-bookmark.dto';

@Injectable()
export class PhonebookService {

  constructor(private readonly prisma: PrismaService){};

  async createContact(createPhonebookDto: CreatePhonebookDto, user: User, file) {
      const avatarPath = file && normalize(`${__dirname}../../../files/avatar/${file.filename}`); 
      
      const isNameExist = await this.prisma.phonebook.findUnique({
        where: { name: createPhonebookDto.name}
      })

      if(isNameExist){
        return {
          status: false,
          message: 'Contact already exist with the same name!'
        }
      }

      const isNumberExist = await this.prisma.phonebook.findUnique({
        where: {
          phone: createPhonebookDto.phone
        }
      })

      if(isNumberExist){
        return {
          status: false,
          message: 'contact already exist!'
        }
      }

      const contact = await this.prisma.phonebook.create({
        data: {
          ...createPhonebookDto,
          ...( file &&  {avatar_url: avatarPath} ),
          user_id: user.id
        }
      })
      
      return {
        status: true,
        message: 'Contact saved successfully!'
      }
  }

  async updateContact(updatePhonebookDto: UpdatePhonebookDto, user: User, file, id){
    const { phone, name } = updatePhonebookDto;
    const avatarPath = file && normalize(`${__dirname}../../../files/avatar/${file.filename}`); 

    const contact = await this.prisma.phonebook.findFirst({
      where: { 
        id,
        user_id: user.id,
        isDeleted: false
      }
    })

    const isNameExist = await this.prisma.phonebook.findUnique({
      where: { name }
    })

    if(isNameExist && isNameExist.id !== id){
      return {
        status: false,
        message: "Name already exist!"
      }
    }

    const isPhoneExist = await this.prisma.phonebook.findUnique({
      where: { phone }       
    })

    if(isPhoneExist && isPhoneExist.id !== id){
      return {
        status: false,
        message: "Number already exist!"
      }
    }


    if(!contact){
      return {
        status: false,
        message: 'No such contact exist!'
      }
    }

    const updatedContact = await this.prisma.phonebook.update({
      where: { id },
      data: {
        ...updatePhonebookDto,
        ...(avatarPath && { avatar_url: avatarPath })
      }
    })


    return {
      status: true,
      message: 'Contact updated successfully!'
    };
  }

  async findAll(user: User, skip: number, q: string | undefined, filterBy: Label | undefined) {
    
    const {_count : count} = await this.prisma.phonebook.aggregate({
        where: {
          user_id: user.id,
          isDeleted: false,
          ...(filterBy && {
            label: filterBy
          }),
          ...(q && {
            name: {
              search:  q + "*"
            }
          })
        },
        _count: true
    })
    
    const contacts = await this.prisma.phonebook.findMany({
      where: {
        user_id: user.id,
        isDeleted: false,
        ...(q && {
          name: {
            search: q + "*"
          },
          address: {
            search:  q + "*"
          }
        }),
        ...(filterBy && {
          label: filterBy
        })
      },
      select: {
        id: true,
        name: true,
        avatar_url: true,
        phone: true,
        address: true,
        label: true,
        isBookmarked: true
      },
      orderBy: {
        name: 'asc',
      },
      skip: skip,
      take: 10
    })

    return {
      status: true,
      data: contacts,
      count
    }
  }

  async updateBookmark(id: number, updateBookmarkDto: UpdateBookmarkDto, user: User){
    const contact = await this.prisma.phonebook.findFirst({
      where: {
        id,
        user_id: user.id,
        isDeleted: false
      }
    })  

    if(!contact){
      return {
        status: false,
        message: 'No such contact exist!'
      }
    }

    const updatedContact = await this.prisma.phonebook.update({
      where: {
        id
      },
      data: {
        isBookmarked: !updateBookmarkDto.isBookmarked
      }
    })

    const message = updateBookmarkDto.isBookmarked ? 'Bookmark removed successfully!' : 'Bookmarked successfully!'

    return {
      status: true,
      message
    }
  }

  async removeContact(id: number, user: User) {
    const contact = await this.prisma.phonebook.findFirst({
      where: {
        id,
        user_id: user.id,
        isDeleted: false
      }
    })

    if(!contact){
      return {
        status: false,
        message: 'No such contact exist!'
      }
    }

    const deletedData = await this.prisma.phonebook.update({
      where: { id },
      data: { isDeleted: true}
    })

    return {
      status: true,
      message: 'Contact deleted successfully!'
    }
  }

  async getOneContact(id: number, user: User){
    const contact =  await this.prisma.phonebook.findFirst({
      where: {
        id,
        user_id: user.id,
        isDeleted: false
      },
      select: {
        id: true,
        name: true,
        phone: true,
        address: true,
        isBookmarked: true,
        avatar_url: true,
        label: true
      }
    })

    if(!contact){
      return {
        status: false,
        message: 'No such contact exist!'
      }
    }

    return {
      status: true,
      data: contact
    }
  }
}

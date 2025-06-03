export class ConvUserDto {
  id: number;
  email: string;
  password: string;
  name: string;
  posts: number[];
  Message: number[];
}

export class ConvChatDto {
  id: number;
  title: string;
  users: number[];
  createdAt: string;
  Message: number[];
}

export class ConvMessageDto {
  id: number;
  content: string;
  userid: number;
  chatid: number;
  timestamp: string;
}

export class ConvDataDto {
  users: ConvUserDto[];
  chats: ConvChatDto[];
  messages: ConvMessageDto[];
}

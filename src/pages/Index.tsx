import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState('chats');
  const [selectedChat, setSelectedChat] = useState(null);

  // Демо пользователи
  const users = [
    { id: 1, name: 'Himo', email: 'himo@admin.com', role: 'admin', avatar: '👑', status: 'online' },
    { id: 2, name: 'Анна Петрова', email: 'anna@mail.com', role: 'user', avatar: '👩', status: 'online' },
    { id: 3, name: 'Максим Иванов', email: 'max@mail.com', role: 'user', avatar: '👨', status: 'offline' },
    { id: 4, name: 'София Козлова', email: 'sofia@mail.com', role: 'user', avatar: '👱‍♀️', status: 'online' },
  ];

  // Демо чаты
  const chats = [
    { 
      id: 1, 
      name: 'Анна Петрова', 
      avatar: '👩', 
      lastMessage: 'Привет! Как дела?', 
      time: '12:34', 
      unread: 2,
      status: 'online'
    },
    { 
      id: 2, 
      name: 'Команда проекта', 
      avatar: '👥', 
      lastMessage: 'Встреча завтра в 10:00', 
      time: '11:20', 
      unread: 0,
      status: 'online'
    },
    { 
      id: 3, 
      name: 'Максим Иванов', 
      avatar: '👨', 
      lastMessage: 'Отправил файлы', 
      time: 'Вчера', 
      unread: 1,
      status: 'offline'
    },
  ];

  // Демо сообщения
  const messages = [
    { id: 1, sender: 'Анна Петрова', text: 'Привет! Как дела?', time: '12:34', isOwn: false },
    { id: 2, sender: 'Вы', text: 'Все отлично! А у тебя как?', time: '12:35', isOwn: true },
    { id: 3, sender: 'Анна Петрова', text: 'Тоже хорошо, работаю над новым проектом', time: '12:36', isOwn: false },
  ];

  const handleLogin = (email: string, password: string) => {
    const user = users.find(u => u.email === email);
    if (user) {
      // Специальная проверка для админа Himo
      if (user.email === 'himo@admin.com' && password !== 'admin123') {
        alert('Неверный пароль для аккаунта администратора');
        return;
      }
      setCurrentUser(user);
      setIsAuthenticated(true);
    } else {
      alert('Пользователь не найден');
    }
  };

  const handleRegister = (name: string, email: string, password: string) => {
    const newUser = {
      id: users.length + 1,
      name,
      email,
      role: 'user',
      avatar: '👤',
      status: 'online'
    };
    setCurrentUser(newUser);
    setIsAuthenticated(true);
  };

  // Функции для админа
  const banUser = (userId: number) => {
    console.log(`Пользователь ${userId} заблокирован`);
  };

  const deleteUser = (userId: number) => {
    console.log(`Аккаунт пользователя ${userId} удален`);
  };

  if (!isAuthenticated) {
    return <AuthScreen onLogin={handleLogin} onRegister={handleRegister} />;
  }

  return (
    <div className="h-screen flex bg-gray-50">
      {/* Боковая панель */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Заголовок с профилем */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarFallback className="bg-blue-500 text-white text-xl">
                {currentUser.avatar}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">{currentUser.name}</h3>
              <p className="text-sm text-gray-500">{currentUser.role === 'admin' ? 'Администратор' : 'Пользователь'}</p>
            </div>
            {currentUser.role === 'admin' && (
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                <Icon name="Crown" size={12} className="mr-1" />
                Admin
              </Badge>
            )}
          </div>
        </div>

        {/* Навигация */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <TabsList className="grid w-full grid-cols-4 m-4 mb-0">
            <TabsTrigger value="chats" className="text-xs">
              <Icon name="MessageCircle" size={16} />
            </TabsTrigger>
            <TabsTrigger value="contacts" className="text-xs">
              <Icon name="Users" size={16} />
            </TabsTrigger>
            <TabsTrigger value="profile" className="text-xs">
              <Icon name="User" size={16} />
            </TabsTrigger>
            {currentUser.role === 'admin' && (
              <TabsTrigger value="admin" className="text-xs">
                <Icon name="Shield" size={16} />
              </TabsTrigger>
            )}
          </TabsList>

          <div className="flex-1 overflow-hidden">
            <TabsContent value="chats" className="h-full m-0">
              <ChatsList chats={chats} selectedChat={selectedChat} onSelectChat={setSelectedChat} />
            </TabsContent>

            <TabsContent value="contacts" className="h-full m-0">
              <ContactsList contacts={users.filter(u => u.id !== currentUser.id)} />
            </TabsContent>

            <TabsContent value="profile" className="h-full m-0">
              <ProfileSettings user={currentUser} />
            </TabsContent>

            {currentUser.role === 'admin' && (
              <TabsContent value="admin" className="h-full m-0">
                <AdminPanel users={users} onBanUser={banUser} onDeleteUser={deleteUser} />
              </TabsContent>
            )}
          </div>
        </Tabs>
      </div>

      {/* Область чата */}
      <div className="flex-1 flex flex-col">
        {selectedChat ? (
          <ChatArea chat={selectedChat} messages={messages} />
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="text-center">
              <Icon name="MessageCircle" size={64} className="mx-auto text-blue-500 mb-4" />
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">Добро пожаловать в мессенджер!</h2>
              <p className="text-gray-600">Выберите чат для начала общения</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Компонент авторизации
const AuthScreen = ({ onLogin, onRegister }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLogin) {
      onLogin(email, password);
    } else {
      onRegister(name, email, password);
    }
  };

  const demoLogin = (userEmail) => {
    if (userEmail === 'himo@admin.com') {
      // Для админа требуется настоящий пароль
      alert('Для входа в аккаунт администратора введите пароль вручную');
      return;
    }
    onLogin(userEmail, 'demo');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800">
      <div className="w-full max-w-md">
        <Card className="shadow-2xl border-0">
          <CardHeader className="text-center pb-2">
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="MessageCircle" size={32} className="text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Мессенджер</h1>
            <p className="text-gray-600">
              {isLogin ? 'Войдите в свой аккаунт' : 'Создайте новый аккаунт'}
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <Input
                  placeholder="Ваше имя"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              )}
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Input
                type="password"
                placeholder="Пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                {isLogin ? 'Войти' : 'Зарегистрироваться'}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">или попробуйте демо</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-center p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="flex items-center justify-center mb-2">
                  <span className="text-lg mr-2">👑</span>
                  <span className="font-semibold text-gray-800">Аккаунт администратора</span>
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  Email: <code className="bg-gray-100 px-1 rounded">himo@admin.com</code>
                </p>
                <p className="text-sm text-gray-600">
                  Пароль: <code className="bg-gray-100 px-1 rounded">admin123</code>
                </p>
              </div>
              <Button
                onClick={() => demoLogin('anna@mail.com')}
                variant="outline"
                className="w-full justify-start"
              >
                <span className="text-lg mr-3">👩</span>
                Войти как Анна
              </Button>
            </div>

            <div className="text-center">
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                {isLogin ? 'Нет аккаунта? Зарегистрируйтесь' : 'Есть аккаунт? Войдите'}
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Компонент списка чатов
const ChatsList = ({ chats, selectedChat, onSelectChat }) => {
  return (
    <div className="p-4 space-y-2 h-full overflow-y-auto">
      <div className="relative mb-4">
        <Icon name="Search" size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <Input placeholder="Поиск чатов..." className="pl-10" />
      </div>
      
      {chats.map((chat) => (
        <Card
          key={chat.id}
          className={`cursor-pointer transition-all hover:shadow-md ${
            selectedChat?.id === chat.id ? 'ring-2 ring-blue-500 bg-blue-50' : ''
          }`}
          onClick={() => onSelectChat(chat)}
        >
          <CardContent className="p-3">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Avatar>
                  <AvatarFallback className="bg-blue-500 text-white">
                    {chat.avatar}
                  </AvatarFallback>
                </Avatar>
                {chat.status === 'online' && (
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-gray-900 truncate">{chat.name}</h3>
                  <span className="text-xs text-gray-500">{chat.time}</span>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-600 truncate">{chat.lastMessage}</p>
                  {chat.unread > 0 && (
                    <Badge className="bg-blue-500 text-white text-xs">{chat.unread}</Badge>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

// Компонент области чата
const ChatArea = ({ chat, messages }) => {
  const [newMessage, setNewMessage] = useState('');

  const sendMessage = () => {
    if (newMessage.trim()) {
      console.log('Отправка сообщения:', newMessage);
      setNewMessage('');
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Заголовок чата */}
      <div className="p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Avatar>
              <AvatarFallback className="bg-blue-500 text-white">
                {chat.avatar}
              </AvatarFallback>
            </Avatar>
            {chat.status === 'online' && (
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
            )}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{chat.name}</h3>
            <p className="text-sm text-gray-500">
              {chat.status === 'online' ? 'в сети' : 'был(а) недавно'}
            </p>
          </div>
        </div>
      </div>

      {/* Сообщения */}
      <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.isOwn
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-900 shadow-sm'
                }`}
              >
                <p>{message.text}</p>
                <p className={`text-xs mt-1 ${message.isOwn ? 'text-blue-100' : 'text-gray-500'}`}>
                  {message.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Поле ввода */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <div className="flex gap-2">
          <Input
            placeholder="Введите сообщение..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            className="flex-1"
          />
          <Button onClick={sendMessage} className="bg-blue-500 hover:bg-blue-600">
            <Icon name="Send" size={18} />
          </Button>
        </div>
      </div>
    </div>
  );
};

// Компонент списка контактов
const ContactsList = ({ contacts }) => {
  return (
    <div className="p-4 space-y-2 h-full overflow-y-auto">
      <h3 className="font-semibold text-gray-900 mb-4">Контакты</h3>
      {contacts.map((contact) => (
        <Card key={contact.id} className="cursor-pointer hover:shadow-md transition-all">
          <CardContent className="p-3">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Avatar>
                  <AvatarFallback className="bg-blue-500 text-white">
                    {contact.avatar}
                  </AvatarFallback>
                </Avatar>
                {contact.status === 'online' && (
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                )}
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">{contact.name}</h4>
                <p className="text-sm text-gray-600">{contact.email}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

// Компонент настроек профиля
const ProfileSettings = ({ user }) => {
  return (
    <div className="p-4 h-full overflow-y-auto">
      <h3 className="font-semibold text-gray-900 mb-4">Профиль</h3>
      <div className="space-y-4">
        <div className="text-center">
          <Avatar className="w-20 h-20 mx-auto mb-4">
            <AvatarFallback className="bg-blue-500 text-white text-2xl">
              {user.avatar}
            </AvatarFallback>
          </Avatar>
          <h4 className="font-semibold text-lg">{user.name}</h4>
          <p className="text-gray-600">{user.email}</p>
        </div>
        
        <Card>
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Icon name="User" size={18} className="text-gray-500" />
              <span className="text-sm">Имя: {user.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <Icon name="Mail" size={18} className="text-gray-500" />
              <span className="text-sm">Email: {user.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Icon name="Shield" size={18} className="text-gray-500" />
              <span className="text-sm">Роль: {user.role === 'admin' ? 'Администратор' : 'Пользователь'}</span>
            </div>
          </CardContent>
        </Card>

        <Button className="w-full" variant="outline">
          <Icon name="Settings" size={18} className="mr-2" />
          Настройки
        </Button>
      </div>
    </div>
  );
};

// Компонент админ-панели
const AdminPanel = ({ users, onBanUser, onDeleteUser }) => {
  return (
    <div className="p-4 h-full overflow-y-auto">
      <h3 className="font-semibold text-gray-900 mb-4">Админ-панель</h3>
      <div className="space-y-3">
        {users.filter(user => user.role !== 'admin').map((user) => (
          <Card key={user.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback className="bg-blue-500 text-white">
                      {user.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-semibold">{user.name}</h4>
                    <p className="text-sm text-gray-600">{user.email}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onBanUser(user.id)}
                    className="text-orange-600 hover:text-orange-700"
                  >
                    <Icon name="Ban" size={16} className="mr-1" />
                    Бан
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => onDeleteUser(user.id)}
                  >
                    <Icon name="Trash2" size={16} className="mr-1" />
                    Удалить
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Index;
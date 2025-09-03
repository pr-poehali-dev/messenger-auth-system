import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState('chats');
  const [selectedChat, setSelectedChat] = useState(null);
  
  // Состояния для сообщений
  const [allMessages, setAllMessages] = useState({});
  const [allChats, setAllChats] = useState([]);
  const [allUsers, setAllUsers] = useState([]);

  // Генерация уникального ID пользователя
  const generateUserId = () => {
    return Math.random().toString(36).substr(2, 8).toUpperCase();
  };

  // Инициализация данных
  useEffect(() => {
    const initialUsers = [
      { 
        id: 1, 
        name: 'Himo', 
        email: 'himo@admin.com', 
        role: 'admin', 
        avatar: '👑', 
        status: 'online',
        userId: 'HIMO2024'
      },
      { 
        id: 3, 
        name: 'Максим Иванов', 
        email: 'max@mail.com', 
        role: 'user', 
        avatar: '👨', 
        status: 'offline',
        userId: 'MAX1X7Y9'
      },
      { 
        id: 4, 
        name: 'София Козлова', 
        email: 'sofia@mail.com', 
        role: 'user', 
        avatar: '👱‍♀️', 
        status: 'online',
        userId: 'SOF8Z3A1'
      },
    ];

    const initialChats = [
      { 
        id: 2, 
        name: 'Команда проекта', 
        avatar: '👥', 
        lastMessage: 'Встреча завтра в 10:00', 
        time: '11:20', 
        unread: 0,
        status: 'online',
        participantIds: [1, 3, 4],
        isGroup: true
      },
      { 
        id: 3, 
        name: 'Максим Иванов', 
        avatar: '👨', 
        lastMessage: 'Отправил файлы', 
        time: 'Вчера', 
        unread: 1,
        status: 'offline',
        participantIds: [3],
        isGroup: false
      },
      {
        id: 4,
        name: 'София Козлова',
        avatar: '👱‍♀️',
        lastMessage: 'До встречи!',
        time: '15:45',
        unread: 0,
        status: 'online',
        participantIds: [4],
        isGroup: false
      },
    ];

    const initialMessages = {
      2: [
        { id: 1, senderId: 3, senderName: 'Максим Иванов', text: 'Встреча завтра в 10:00', time: '11:20', isOwn: false },
        { id: 2, senderId: 1, senderName: 'Вы', text: 'Будем готовы!', time: '11:21', isOwn: true },
        { id: 3, senderId: 4, senderName: 'София Козлова', text: 'Отлично, я подготовлю материалы', time: '11:22', isOwn: false },
      ],
      3: [
        { id: 1, senderId: 3, senderName: 'Максим Иванов', text: 'Отправил файлы', time: 'Вчера', isOwn: false },
      ],
      4: [
        { id: 1, senderId: 4, senderName: 'София Козлова', text: 'До встречи!', time: '15:45', isOwn: false },
      ]
    };

    setAllUsers(initialUsers);
    setAllChats(initialChats);
    setAllMessages(initialMessages);
  }, []);

  const handleLogin = (email: string, password: string) => {
    const user = allUsers.find(u => u.email === email);
    if (user) {
      // Специальная проверка для админа Himo
      if (user.email === 'himo@admin.com' && password !== 'admin123') {
        alert('Неверный пароль для аккаунта администратора');
        return;
      }
      setCurrentUser(user);
      setIsAuthenticated(true);
      
      // Обновляем статус пользователя на онлайн
      setAllUsers(prev => prev.map(u => 
        u.id === user.id ? {...u, status: 'online'} : u
      ));
    } else {
      alert('Пользователь не найден');
    }
  };

  const handleRegister = (name: string, email: string, password: string) => {
    const newUserId = generateUserId();
    const newUser = {
      id: Date.now(),
      name,
      email,
      role: 'user',
      avatar: '👤',
      status: 'online',
      userId: newUserId
    };
    
    setAllUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    setIsAuthenticated(true);
  };

  // Отправка сообщения
  const sendMessage = (chatId: number, text: string) => {
    if (!text.trim() || !currentUser) return;

    const newMessage = {
      id: Date.now(),
      senderId: currentUser.id,
      senderName: 'Вы',
      text: text.trim(),
      time: new Date().toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' }),
      isOwn: true
    };

    // Добавляем сообщение
    setAllMessages(prev => ({
      ...prev,
      [chatId]: [...(prev[chatId] || []), newMessage]
    }));

    // Обновляем последнее сообщение в чате
    setAllChats(prev => prev.map(chat => 
      chat.id === chatId 
        ? { ...chat, lastMessage: text.trim(), time: newMessage.time, unread: 0 }
        : chat
    ));
  };

  // Поиск пользователя по ID
  const findUserById = (userId: string) => {
    const user = allUsers.find(u => u.userId === userId.toUpperCase());
    if (user && user.id !== currentUser.id) {
      // Создаем новый чат если его нет
      const existingChat = allChats.find(chat => 
        !chat.isGroup && chat.participantIds.includes(user.id)
      );
      
      if (!existingChat) {
        const newChat = {
          id: Date.now(),
          name: user.name,
          avatar: user.avatar,
          lastMessage: 'Начните общение!',
          time: 'Сейчас',
          unread: 0,
          status: user.status,
          participantIds: [user.id],
          isGroup: false
        };
        setAllChats(prev => [...prev, newChat]);
      }
      return user;
    }
    return null;
  };

  // Функции для админа
  const banUser = (userId: number) => {
    setAllUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, status: 'banned' } : user
    ));
    alert('Пользователь заблокирован');
  };

  const deleteUser = (userId: number) => {
    setAllUsers(prev => prev.filter(user => user.id !== userId));
    setAllChats(prev => prev.filter(chat => !chat.participantIds.includes(userId)));
    alert('Аккаунт пользователя удален');
  };

  const promoteToAdmin = (userId: number) => {
    setAllUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, role: 'admin' } : user
    ));
    alert('Пользователь назначен администратором');
  };

  const demoteFromAdmin = (userId: number) => {
    setAllUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, role: 'user' } : user
    ));
    alert('Права администратора отозваны');
  };

  if (!isAuthenticated) {
    return <AuthScreen onLogin={handleLogin} onRegister={handleRegister} users={allUsers} />;
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
              <p className="text-sm text-gray-500">ID: {currentUser.userId}</p>
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
              <ChatsList 
                chats={allChats} 
                selectedChat={selectedChat} 
                onSelectChat={setSelectedChat}
                onFindUser={findUserById}
              />
            </TabsContent>

            <TabsContent value="contacts" className="h-full m-0">
              <ContactsList 
                contacts={allUsers.filter(u => u.id !== currentUser.id)} 
                onFindUser={findUserById}
              />
            </TabsContent>

            <TabsContent value="profile" className="h-full m-0">
              <ProfileSettings user={currentUser} />
            </TabsContent>

            {currentUser.role === 'admin' && (
              <TabsContent value="admin" className="h-full m-0">
                <AdminPanel 
                  users={allUsers.filter(u => u.id !== currentUser.id)} 
                  onBanUser={banUser} 
                  onDeleteUser={deleteUser}
                  onPromoteToAdmin={promoteToAdmin}
                  onDemoteFromAdmin={demoteFromAdmin}
                />
              </TabsContent>
            )}
          </div>
        </Tabs>
      </div>

      {/* Область чата */}
      <div className="flex-1 flex flex-col">
        {selectedChat ? (
          <ChatArea 
            chat={selectedChat} 
            messages={allMessages[selectedChat.id] || []} 
            onSendMessage={(text) => sendMessage(selectedChat.id, text)}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="text-center">
              <Icon name="MessageCircle" size={64} className="mx-auto text-blue-500 mb-4" />
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">Добро пожаловать в мессенджер!</h2>
              <p className="text-gray-600 mb-4">Выберите чат для начала общения</p>
              <p className="text-sm text-gray-500">Ваш ID: <code className="bg-gray-200 px-2 py-1 rounded">{currentUser.userId}</code></p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Компонент авторизации
const AuthScreen = ({ onLogin, onRegister, users }) => {
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
              <Button
                onClick={() => demoLogin('max@mail.com')}
                variant="outline"
                className="w-full justify-start"
              >
                <span className="text-lg mr-3">👨</span>
                Войти как Максим
              </Button>
              <Button
                onClick={() => demoLogin('sofia@mail.com')}
                variant="outline"
                className="w-full justify-start"
              >
                <span className="text-lg mr-3">👱‍♀️</span>
                Войти как София
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
const ChatsList = ({ chats, selectedChat, onSelectChat, onFindUser }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [userIdQuery, setUserIdQuery] = useState('');

  const handleFindUser = () => {
    if (userIdQuery.trim()) {
      const foundUser = onFindUser(userIdQuery.trim());
      if (foundUser) {
        alert(`Пользователь найден: ${foundUser.name}`);
        setUserIdQuery('');
      } else {
        alert('Пользователь с таким ID не найден');
      }
    }
  };

  const filteredChats = chats.filter(chat =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-4 space-y-2 h-full overflow-y-auto">
      <div className="space-y-3 mb-4">
        <div className="relative">
          <Icon name="Search" size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input 
            placeholder="Поиск чатов..." 
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <Input 
            placeholder="ID пользователя..." 
            value={userIdQuery}
            onChange={(e) => setUserIdQuery(e.target.value)}
            className="flex-1"
          />
          <Button onClick={handleFindUser} size="sm">
            <Icon name="UserPlus" size={16} />
          </Button>
        </div>
      </div>
      
      {filteredChats.map((chat) => (
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
                {chat.status === 'online' && !chat.isGroup && (
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-gray-900 truncate">
                    {chat.name}
                    {chat.isGroup && <Icon name="Users" size={14} className="inline ml-1" />}
                  </h3>
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
const ChatArea = ({ chat, messages, onSendMessage }) => {
  const [newMessage, setNewMessage] = useState('');

  const sendMessage = () => {
    if (newMessage.trim()) {
      onSendMessage(newMessage);
      setNewMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
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
            {chat.status === 'online' && !chat.isGroup && (
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
            )}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 flex items-center gap-1">
              {chat.name}
              {chat.isGroup && <Icon name="Users" size={16} />}
            </h3>
            <p className="text-sm text-gray-500">
              {chat.isGroup ? 'Групповой чат' : (chat.status === 'online' ? 'в сети' : 'был(а) недавно')}
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
              <div className="max-w-xs lg:max-w-md">
                {!message.isOwn && chat.isGroup && (
                  <p className="text-xs text-gray-500 mb-1 ml-1">{message.senderName}</p>
                )}
                <div
                  className={`px-4 py-2 rounded-lg ${
                    message.isOwn
                      ? 'bg-blue-500 text-white rounded-br-sm'
                      : 'bg-white text-gray-900 shadow-sm rounded-bl-sm'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.text}</p>
                  <p className={`text-xs mt-1 ${message.isOwn ? 'text-blue-100' : 'text-gray-500'}`}>
                    {message.time}
                  </p>
                </div>
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
            onKeyPress={handleKeyPress}
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
const ContactsList = ({ contacts, onFindUser }) => {
  const [userIdQuery, setUserIdQuery] = useState('');

  const handleFindUser = () => {
    if (userIdQuery.trim()) {
      const foundUser = onFindUser(userIdQuery.trim());
      if (foundUser) {
        alert(`Пользователь найден: ${foundUser.name}`);
        setUserIdQuery('');
      } else {
        alert('Пользователь с таким ID не найден');
      }
    }
  };

  return (
    <div className="p-4 space-y-2 h-full overflow-y-auto">
      <div className="mb-4">
        <h3 className="font-semibold text-gray-900 mb-3">Контакты</h3>
        <div className="flex gap-2 mb-4">
          <Input 
            placeholder="Найти по ID..." 
            value={userIdQuery}
            onChange={(e) => setUserIdQuery(e.target.value)}
            className="flex-1"
          />
          <Button onClick={handleFindUser} size="sm">
            <Icon name="Search" size={16} />
          </Button>
        </div>
      </div>
      
      {contacts.map((contact) => (
        <Card key={contact.id} className="cursor-pointer hover:shadow-md transition-all">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
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
                  <p className="text-sm text-gray-600">ID: {contact.userId}</p>
                </div>
              </div>
              {contact.role === 'admin' && (
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                  <Icon name="Crown" size={12} className="mr-1" />
                  Admin
                </Badge>
              )}
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
              <Icon name="Hash" size={18} className="text-gray-500" />
              <span className="text-sm">ID: {user.userId}</span>
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
const AdminPanel = ({ users, onBanUser, onDeleteUser, onPromoteToAdmin, onDemoteFromAdmin }) => {
  return (
    <div className="p-4 h-full overflow-y-auto">
      <h3 className="font-semibold text-gray-900 mb-4">Админ-панель</h3>
      <div className="space-y-3">
        {users.map((user) => (
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
                    <h4 className="font-semibold flex items-center gap-2">
                      {user.name}
                      {user.role === 'admin' && (
                        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                          <Icon name="Crown" size={12} className="mr-1" />
                          Admin
                        </Badge>
                      )}
                    </h4>
                    <p className="text-sm text-gray-600">ID: {user.userId}</p>
                    <p className="text-sm text-gray-600">{user.email}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  {user.role === 'admin' ? (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onDemoteFromAdmin(user.id)}
                      className="text-orange-600 hover:text-orange-700"
                    >
                      <Icon name="UserMinus" size={16} className="mr-1" />
                      Снять
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onPromoteToAdmin(user.id)}
                      className="text-green-600 hover:text-green-700"
                    >
                      <Icon name="UserPlus" size={16} className="mr-1" />
                      Админ
                    </Button>
                  )}
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
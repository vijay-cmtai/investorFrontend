import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Heart, MessageCircle, Send, Home, Bell } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
interface Property {
  id: string;
  title: string;
  price: number;
  location: string;
  images: string[];
  property_type: string;
}

interface Enquiry {
  id: string;
  property_id: string;
  message: string;
  status: string;
  response: string | null;
  responded_at: string | null;
  created_at: string;
  properties: Property;
}

interface Chat {
  id: string;
  property_id: string;
  user_id: string;
  property_owner_id: string;
  created_at: string;
  properties: Property;
  messages: Message[];
}

interface Message {
  id: string;
  chat_id: string;
  sender_id: string;
  message: string;
  created_at: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<Property[]>([]);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [activeTab, setActiveTab] = useState("favorites");

  useEffect(() => {
    checkUser();
  }, []);

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const checkUser = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }
      setUser(session.user);
    } catch (error) {
      console.error("Error checking user:", error);
      navigate("/auth");
    } finally {
      setLoading(false);
    }
  };

  const fetchUserData = async () => {
    try {
      // Fetch favorites
      const { data: favoritesData } = await supabase
        .from("favorites")
        .select(`
          properties (
            id, title, price, location, images, property_type
          )
        `)
        .eq("user_id", user.id);

      if (favoritesData) {
        setFavorites(favoritesData.map((fav: any) => fav.properties));
      }

      // Fetch enquiries
      const { data: enquiriesData } = await supabase
        .from("enquiries")
        .select(`
          *,
          properties (
            id, title, price, location, images, property_type
          )
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (enquiriesData) {
        setEnquiries(enquiriesData);
      }

      // Fetch chats with messages
      const { data: chatsData } = await supabase
        .from("chats")
        .select(`
          *,
          properties (
            id, title, price, location, images, property_type
          ),
          messages (
            id, chat_id, sender_id, message, created_at
          )
        `)
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false });

      if (chatsData) {
        setChats(chatsData.map((chat: any) => ({
          ...chat,
          messages: chat.messages.sort((a: Message, b: Message) => 
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          )
        })));
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive"
      });
    }
  };
  const removeFavorite = async (propertyId: string) => {
    try {
      await supabase
        .from("favorites")
        .delete()
        .eq("user_id", user.id)
        .eq("property_id", propertyId);

      setFavorites(favorites.filter(fav => fav.id !== propertyId));
      toast({
        title: "Success",
        description: "Property removed from favorites"
      });
    } catch (error) {
      console.error("Error removing favorite:", error);
      toast({
        title: "Error",
        description: "Failed to remove from favorites",
        variant: "destructive"
      });
    }
  };
  const sendMessage = async () => {
    if (!selectedChat || !newMessage.trim()) return;

    try {
      const { error } = await supabase
        .from("messages")
        .insert({
          chat_id: selectedChat.id,
          sender_id: user.id,
          message: newMessage.trim()
        });

      if (error) throw error;

      setNewMessage("");
      fetchUserData();
      toast({
        title: "Success",
        description: "Message sent successfully"
      });
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive"
      });
    }
  };
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-background">
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">My Dashboard</h1>
          <p className="text-muted-foreground">Manage your properties, enquiries, and communications</p>
        </div>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="favorites" className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              Favorites ({favorites.length})
            </TabsTrigger>
            <TabsTrigger value="enquiries" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Enquiries ({enquiries.length})
            </TabsTrigger>
            <TabsTrigger value="chats" className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              Chats ({chats.length})
            </TabsTrigger>
          </TabsList>
          <TabsContent value="favorites" className="space-y-4">
            {favorites.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                  <Heart className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No favorites yet</h3>
                  <p className="text-muted-foreground mb-4">Start browsing properties to add them to your favorites</p>
                  <Button onClick={() => navigate("/buy")}>Browse Properties</Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {favorites.map((property) => (
                  <Card key={property.id} className="group hover:shadow-lg transition-shadow cursor-pointer">
                    <div onClick={() => navigate(`/property/${property.id}`)}>
                      <div className="aspect-video relative overflow-hidden rounded-t-lg">
                        <img
                          src={property.images?.[0] || "/placeholder.svg"}
                          alt={property.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-foreground mb-2">{property.title}</h3>
                        <p className="text-sm text-muted-foreground mb-2">{property.location}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold text-primary">₹{property.price.toLocaleString()}</span>
                          <Badge variant="secondary">{property.property_type}</Badge>
                        </div>
                      </CardContent>
                    </div>
                    <CardContent className="px-4 pb-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeFavorite(property.id)}
                        className="w-full"
                      >
                        Remove from Favorites
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
          <TabsContent value="enquiries" className="space-y-4">
            {enquiries.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                  <Bell className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No enquiries yet</h3>
                  <p className="text-muted-foreground mb-4">Your property enquiries will appear here</p>
                  <Button onClick={() => navigate("/buy")}>Browse Properties</Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {enquiries.map((enquiry) => (
                  <Card key={enquiry.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{enquiry.properties.title}</CardTitle>
                          <CardDescription>{enquiry.properties.location}</CardDescription>
                        </div>
                        <Badge variant={enquiry.status === 'pending' ? 'secondary' : 'default'}>
                          {enquiry.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">Your Message:</h4>
                        <p className="text-sm text-muted-foreground">{enquiry.message}</p>
                      </div>
                      {enquiry.response && (
                        <div>
                          <h4 className="font-medium mb-2">Response:</h4>
                          <p className="text-sm bg-muted p-3 rounded-lg">{enquiry.response}</p>
                          {enquiry.responded_at && (
                            <p className="text-xs text-muted-foreground mt-1">
                              Responded on {new Date(enquiry.responded_at).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      )}
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/property/${enquiry.property_id}`)}
                        >
                          View Property
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="chats" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle>Chats</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    {chats.length === 0 ? (
                      <div className="p-4 text-center text-muted-foreground">
                        No chats yet
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {chats.map((chat) => (
                          <div
                            key={chat.id}
                            className={`p-4 cursor-pointer hover:bg-muted transition-colors ${
                              selectedChat?.id === chat.id ? 'bg-muted' : ''
                            }`}
                            onClick={() => setSelectedChat(chat)}
                          >
                            <h4 className="font-medium text-sm">{chat.properties.title}</h4>
                            <p className="text-xs text-muted-foreground">{chat.properties.location}</p>
                            {chat.messages.length > 0 && (
                              <p className="text-xs text-muted-foreground mt-1">
                                Last: {chat.messages[chat.messages.length - 1].message.substring(0, 30)}...
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              <div className="lg:col-span-2">
                <Card className="h-[500px] flex flex-col">
                  {selectedChat ? (
                    <>
                      <CardHeader>
                        <CardTitle className="text-lg">{selectedChat.properties.title}</CardTitle>
                        <CardDescription>Chat with property owner</CardDescription>
                      </CardHeader>
                      <CardContent className="flex-1 flex flex-col">
                        <ScrollArea className="flex-1 pr-4">
                          <div className="space-y-4">
                            {selectedChat.messages.map((message) => (
                              <div
                                key={message.id}
                                className={`flex ${
                                  message.sender_id === user.id ? 'justify-end' : 'justify-start'
                                }`}
                              >
                                <div
                                  className={`max-w-[80%] p-3 rounded-lg ${
                                    message.sender_id === user.id
                                      ? 'bg-primary text-primary-foreground'
                                      : 'bg-muted'
                                  }`}
                                >
                                  <p className="text-sm">{message.message}</p>
                                  <p className="text-xs opacity-70 mt-1">
                                    {new Date(message.created_at).toLocaleTimeString()}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                        <div className="flex gap-2 mt-4">
                          <Input
                            placeholder="Type your message..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                            className="flex-1"
                          />
                          <Button onClick={sendMessage} size="sm">
                            <Send className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </>
                  ) : (
                    <CardContent className="flex-1 flex items-center justify-center">
                      <div className="text-center text-muted-foreground">
                        <MessageCircle className="h-12 w-12 mx-auto mb-4" />
                        <p>Select a chat to start messaging</p>
                      </div>
                    </CardContent>
                  )}
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
export default Dashboard;
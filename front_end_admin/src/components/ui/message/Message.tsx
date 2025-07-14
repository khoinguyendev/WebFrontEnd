import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { SERVER_HOST } from "../../../configs/UrlServer";
import { IMessage } from "../../../types/Message";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

const Message = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [messages, setMessages] = useState<IMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const [lastScrollTop, setLastScrollTop] = useState(0);

  const senderId = "nhanvien@gmail.com";
  useEffect(() => {
    const socket = new SockJS(`http://localhost:8080/ws`);
    const client = new Client({
      webSocketFactory: () => socket,
      debug: (str) => console.log("STOMP Debug:", str),
      onConnect: () => {
        console.log("Connected to WebSocket");
        client.subscribe("/client/message", (message) => {
          const newMessage: IMessage = JSON.parse(message.body);
          setMessages((pre) => [...pre, newMessage]);
          if (isOpen) {
            scrollToBottom();
          } else {
            setShouldScrollToBottom(true);
            setIsOpen(true); // vẫn mở chat lên như hiện tại
          }
        });
      },
      onStompError: (frame) => {
        console.error("STOMP Error:", frame.headers["message"]);
      },
    });

    client.activate();

    return () => {
      client.deactivate();
      console.log("WebSocket connection cleaned up");
    };
  }, []);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  const fetchMessages = async () => {
    try {
      const response = await axios.get(
        `${SERVER_HOST}/messages/conversation?user1=03f8de95-1351-48bd-9c8b-03cd7acf3d2b&user2=nhanvien@gmail.com`
      );
      setMessages(response.data);
    } catch (error) {
      console.error("Lỗi tải tin nhắn:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = async () => {
    if (newMessage.trim() === "") return;

    const payload = {
      message: newMessage,
      senderId: "nhanvien@gmail.com",
      receiverId: "03f8de95-1351-48bd-9c8b-03cd7acf3d2b",
      image: "",
    };

    try {
      await axios.post(`${SERVER_HOST}/messages`, payload);
      setNewMessage("");
    } catch (error) {
      console.error("Lỗi gửi tin nhắn:", error);
    }
  };
  const toggleChat = () => {
    if (isOpen && scrollContainerRef.current) {
      // Lưu scrollTop hiện tại
      setLastScrollTop(scrollContainerRef.current.scrollTop);
    }
    setIsOpen(!isOpen);
  };
  useEffect(() => {
    if (isOpen && scrollContainerRef.current) {
      setTimeout(() => {
        if (shouldScrollToBottom) {
          scrollToBottom();
          setShouldScrollToBottom(false); // reset flag
        } else {
          scrollContainerRef.current!.scrollTop = lastScrollTop;
        }
      }, 50);
    }
  }, [isOpen]);

  useEffect(() => {
    fetchMessages();
  }, []);
  const handleSelectImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Gửi hoặc xử lý ảnh tại đây
    console.log("Ảnh đã chọn:", file);

    // Ví dụ: convert sang base64 (nếu muốn preview/send)
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Image = reader.result as string;

      // Gửi ảnh như tin nhắn chẳng hạn:
      sendImageMessage(base64Image);
    };
    reader.readAsDataURL(file);
  };
  const sendImageMessage = async (base64Image: string) => {
    const payload = {
      message: "", // hoặc "Đã gửi ảnh"
      senderId: "nhanvien@gmail.com",
      receiverId: "03f8de95-1351-48bd-9c8b-03cd7acf3d2b",
      image: base64Image,
    };

    try {
      await axios.post(`${SERVER_HOST}/messages`, payload);
    } catch (error) {
      console.error("Lỗi gửi ảnh:", error);
    }
  };
  if (!user) return null; // Nếu không có người dùng, không hiển thị component
  if (user.role !== "STAFF") return null; // Chỉ hiển thị cho nhân viên
  return (
    <div className="fixed bottom-5 right-5 z-50">
      {/* Icon Chat */}
      <button
        onClick={toggleChat}
        className="bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="size-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227
             1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14
              1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233
               2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394
                48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373
                 3.746 2.25 5.14 2.25 6.741v6.018Z"
          />
        </svg>
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div
          className={`w-80 h-96 bg-white shadow-xl rounded-lg border mt-3 p-3 flex flex-col`}
        >
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold text-lg">Tin nhắn</h3>
            <button
              onClick={toggleChat}
              className="text-gray-500 hover:text-red-500 text-sm"
            >
              ✕
            </button>
          </div>

          {/* Danh sách tin nhắn */}
          <div
            className="flex-1 overflow-y-auto border-t border-b py-2 space-y-2"
            ref={scrollContainerRef}
          >
            {isLoading ? (
              <p className="text-center text-sm text-gray-400">Đang tải...</p>
            ) : messages.length === 0 ? (
              <p className="text-center text-sm text-gray-400">
                Chưa có tin nhắn...
              </p>
            ) : (
              <>
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${
                      msg.senderId === senderId
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`px-3 py-2 rounded-lg max-w-[70%] text-sm ${
                        msg.senderId === senderId
                          ? "bg-blue-600 text-white"
                          : "bg-gray-200 text-gray-800"
                      }`}
                    >
                      {msg.image && (
                        <button
                          onClick={() => setPreviewImage(msg.image)}
                          className="focus:outline-none"
                        >
                          <img
                            src={msg.image}
                            alt="image"
                            className="mt-1 rounded max-w-[150px] object-contain hover:brightness-90 transition"
                          />
                        </button>
                      )}
                      {msg.message}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Nhập + gửi tin nhắn */}
          <div className="mt-2 flex items-center space-x-2">
            <input
              type="file"
              accept="image/*"
              onChange={handleSelectImage}
              className="hidden"
              id="upload-image"
            />
            <label
              htmlFor="upload-image"
              className="cursor-pointer p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition"
            >
              📷
            </label>
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Nhập tin nhắn..."
              className="flex-1 border rounded-lg p-2 text-sm"
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button
              onClick={handleSend}
              className="p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12
                   59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
      {previewImage && (
        
        <div
        style={{ zIndex: 10000 }}
          className="fixed inset-0 flex items-center justify-center backdrop-blur-sm backdrop-brightness-95  px-4"
          onClick={() => setPreviewImage(null)}
        >
          <img
            src={previewImage}
            alt="preview"
            className="max-w-full max-h-full rounded-lg shadow-lg"
            onClick={(e) => e.stopPropagation()} // Ngăn đóng khi click ảnh
          />
        </div>
      )}
    </div>
  );
};

export default Message;

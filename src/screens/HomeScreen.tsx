import React, { useState, useEffect } from "react";
import { Text, View, Image, TouchableOpacity, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import axios from "axios";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { getDatabase, ref, query, orderByChild, limitToLast, onValue } from "firebase/database";
import { database } from "../config/firebase";

type RootStackParamList = {
    Home: undefined;
    Emergency: undefined;
    Announcement: undefined;
    Account: undefined;
};

interface WeatherData {
    main: {
        temp: number | null;
    };
    weather: {
        description: string;
        icon: string;
    }[];
}

export default function HomeScreen() {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();

    const [city] = useState("Iloilo City");
    const [weather, setWeather] = useState<WeatherData>({
        main: { temp: null },
        weather: [],
    });
    const API_KEY = "9092faeb532ba0ae5888f54afe9d885f"; // Replace with your OpenWeatherMap API Key

    useEffect(() => {
        fetchWeather();
    }, []);

    const fetchWeather = async () => {
        try {
            const response = await axios.get(
                `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
            );
            setWeather({
                main: response.data.main,
                weather: response.data.weather,
            });
        } catch (error) {
            console.error("Error fetching weather data:", error);
        }
    };

    const [announcements, setAnnouncements] = useState<string[]>([]);
    const [expandedAnnouncements, setExpandedAnnouncements] = useState<Set<number>>(new Set());

    useEffect(() => {
        const fetchAnnouncements = async () => {
            const announcementsRef = ref(database, "announcements");

            const latestAnnouncementsQuery = query(
                announcementsRef,
                orderByChild("timestamp"),
                limitToLast(5) // Change this number to get more announcements
            );

            onValue(latestAnnouncementsQuery, (snapshot) => {
                const data = snapshot.val();
                if (data) {
                    const formattedAnnouncements = Object.values(data)
                        .sort((a: any, b: any) => b.timestamp - a.timestamp) // Sorting in descending order by timestamp
                        .map((announcement: any) => announcement.text); // Extract the message
                    setAnnouncements(formattedAnnouncements);
                } else {
                    setAnnouncements([]);
                }
            });
        };

        fetchAnnouncements();
    }, []);

    const toggleExpand = (index: number) => {
        setExpandedAnnouncements((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(index)) {
                newSet.delete(index);
            } else {
                newSet.add(index);
            }
            return newSet;
        });
    };

    const truncateText = (text: string, length: number) => {
        if (text.length > length) {
            return text.slice(0, length) + "...";
        }
        return text;
    };

    return (
        <LinearGradient
            colors={["#40AEF7", "#3B7FAC"]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            className="flex-1"
        >
            <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
                {/* Header */}
                <View style={{ alignItems: 'center', paddingVertical: 20 }}>
                    <Image
                        source={require("../assets/images/Logo.png")}
                        resizeMode="contain"
                        className="w-80 h-20 mb-2 mt-2"
                    />
                </View>

                {/* Announcement Board */}
                <View className="flex-row items-center px-4">
                    <Image
                        source={require("../assets/images/announcement2.png")}
                        className="w-10 h-10"
                    />
                    <Text className="ml-2 text-white font-bold text-lg">
                        Announcement Board
                    </Text>
                </View>
                <View className="mx-4 mt-4 bg-white rounded-lg p-4 shadow-lg">
                    <Text className="text-white 
                           text-center 
                           font-bold 
                           bg-blue-400 
                           p-3 
                           text-xl
                           rounded-lg
                           mb-4"
                    >WVSU</Text>
                    {announcements.length > 0 ? (
                        announcements.map((announcement, index) => {
                            const isExpanded = expandedAnnouncements.has(index);
                            const displayText = isExpanded ? announcement : truncateText(announcement, 100);

                            return (
                                <View key={index} style={{ marginBottom: 10 }}>
                                    <Text className="text-black text-center font-bold">{displayText}</Text>
                                    {announcement.length > 100 && (
                                        <TouchableOpacity onPress={() => toggleExpand(index)}>
                                            <Text className="text-blue-400 text-center mt-3">
                                                {isExpanded ? "Read Less" : "Read More"}
                                            </Text>
                                        </TouchableOpacity>
                                    )}
                                </View>
                            );
                        })
                    ) : (
                        <Text className="text-gray-500 text-center">No announcements available.</Text>
                    )}
                </View>

                {/* Weather App */}
                <View className="mx-4 mt-8 bg-white rounded-lg shadow-lg">
                    <View className="flex-row items-center px-4 py-2">
                        <Image
                            source={require("../assets/images/Weather.png")}
                            resizeMode="contain"
                            className="w-12 h-12"
                        />
                        <Text className="ml-2 text-black font-semibold text-lg">
                            Weather App
                        </Text>
                    </View>
                    <View className="flex-row items-center justify-between p-4">
                        <View className="flex-1">
                            <Text className="text-gray-600 text-lg">Temperature</Text>
                            <Text className="text-black font-bold text-4xl">
                                {weather.main.temp !== null ? weather.main.temp : "--"}°C
                            </Text>
                            <Text className="text-gray-600 text-lg">{city}</Text>
                        </View>
                        <View className="flex-1 items-center">
                            <Image
                                source={require("../assets/images/sunny.png")}
                                resizeMode="contain"
                                className="w-32 h-32"
                            />
                            <Text className="text-black text-lg">
                                {weather.weather[0]?.description || "N/A"}
                            </Text>
                        </View>
                    </View>
                </View>
            </ScrollView>

            {/* Navigation Bar */}
            <View
                style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: 64,
                    backgroundColor: '#f0f0f0',
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                    alignItems: 'center',
                    borderTopLeftRadius: 12,
                    borderTopRightRadius: 12,
                }}
            >
                <TouchableOpacity onPress={() => navigation.navigate('Home')}>
                    <View style={{ alignItems: 'center' }}>
                        <Image
                            source={require('../assets/images/home.png')}
                            style={{ width: 24, height: 24 }}
                        />
                        <Text>Home</Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate('Announcement')}>
                    <View style={{ alignItems: 'center' }}>
                        <Image
                            source={require('../assets/images/announcement-icon.png')}
                            style={{ width: 24, height: 24 }}
                        />
                        <Text>Announcements</Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate('Emergency')}>
                    <View style={{ alignItems: 'center' }}>
                        <Image
                            source={require('../assets/images/emergency.png')}
                            style={{ width: 24, height: 24 }}
                        />
                        <Text>Emergencies</Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate('Account')}>
                    <View style={{ alignItems: 'center' }}>
                        <Image
                            source={require('../assets/images/account.png')}
                            style={{ width: 24, height: 24 }}
                        />
                        <Text>Account</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </LinearGradient>
    );
}
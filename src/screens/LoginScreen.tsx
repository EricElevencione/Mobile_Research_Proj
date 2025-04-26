import { View, Text, TouchableOpacity, Image, TextInput, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeftIcon } from 'react-native-heroicons/solid';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type RootStackParamList = {
    Index: undefined;
    Login: undefined;
    SignUp: undefined;
    Home: undefined;
};

// Hardcoded user credentials
const HARDCODED_USERS = [
    { email: "admin@fintech.com", password: "Admin123!", role: "admin" },
    { email: "user@fintech.com", password: "User123!", role: "user" },
];

export default function LoginScreen() {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);

    // Load remembered email on mount
    useEffect(() => {
        const loadRememberedEmail = async () => {
            const storedEmail = await AsyncStorage.getItem('rememberedEmail');
            if (storedEmail) {
                setEmail(storedEmail);
                setRememberMe(true);
            }
        };
        loadRememberedEmail();
    }, []);

    const handleSubmit = async () => {
        if (!email || !password) {
            Alert.alert("Error", "Please fill in all fields.");
            return;
        }

        // Find matching user
        const user = HARDCODED_USERS.find(
            u => u.email === email && u.password === password
        );

        if (user) {
            // Handle remember me functionality
            if (rememberMe) {
                await AsyncStorage.setItem('rememberedEmail', email);
            } else {
                await AsyncStorage.removeItem('rememberedEmail');
            }

            navigation.navigate('Home');
            Alert.alert("Success", `Welcome ${user.email}!`);
        } else {
            Alert.alert("Error", "Invalid email or password");
        }
    };

    return (
        <View className='flex-1 bg-blue-400'>
            {/* Keep the existing header and image section */}
            <SafeAreaView style={{ flex: 1 }}>
                <View className='flex-row justify-start'>
                    <TouchableOpacity
                        className='bg-yellow-400 p-2 rounded-tr-2xl rounded-bl-2xl ml-4 mt-4'
                        onPress={() => navigation.goBack()}>
                        <ArrowLeftIcon color='black' size='20' />
                    </TouchableOpacity>
                </View>
                <View className='flex-row justify-center'>
                    <Image source={require('../assets/images/Login.png')} className="w-60 h-60" />
                </View>
            </SafeAreaView>

            {/* Modified form section */}
            <View className='flex-1 bg-white px-8 pt-8 rounded-t-3xl'>
                <View className='form space-y-2'>
                    <Text className='ml-1 mb-2'>Email Address</Text>
                    <TextInput
                        className='p-4 bg-gray-100 rounded-2xl mb-3'
                        placeholder='Enter Email Address'
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />

                    <Text className='ml-1 mb-2'>Password</Text>
                    <TextInput
                        className='p-4 bg-gray-100 rounded-2xl mb-3'
                        secureTextEntry
                        placeholder='Enter Password'
                        value={password}
                        onChangeText={setPassword}
                        autoCapitalize="none"
                    />

                    {/* Remember Me checkbox */}
                    <TouchableOpacity
                        className='flex-row items-center mb-5'
                        onPress={() => setRememberMe(!rememberMe)}
                    >
                        <View className='w-5 h-5 border border-gray-400 mr-2 rounded-sm'>
                            {rememberMe && <Text className='text-center'>✓</Text>}
                        </View>
                        <Text>Remember Me</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        className='py-3 bg-yellow-400 rounded-xl'
                        onPress={handleSubmit}
                    >
                        <Text className='text-xl font-bold text-center'>Login</Text>
                    </TouchableOpacity>
                </View>

                {/* Keep the rest of the UI elements */}
                <Text className='text-xl font-bold text-center py-5'> Or </Text>
                <View className='flex-row justify-center'>
                    <TouchableOpacity className='p-2 bg-gray-100 rounded-2xl mr-5'>
                        <Image source={require('../assets/images/Google.png')} className='w-10 h-10' />
                    </TouchableOpacity>
                    <TouchableOpacity className='p-2 bg-gray-100 rounded-2xl ml-5'>
                        <Image source={require('../assets/images/Facebook.png')} className='w-10 h-10' />
                    </TouchableOpacity>
                </View>
                <View className="flex-row justify-center mt-7">
                    <Text className="font-semibold">Don't have an account? </Text>
                    <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                        <Text className="font-semibold text-yellow-400">Sign Up</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}
import { Text, View, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import '../global.css';

type RootStackParamList = {
  Index: undefined;
  Login: undefined;
  SignUp: undefined;
};

export default function Index() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  return (
    <SafeAreaView className="flex-1 bg-blue-400">
      <View className="flex-1 flex justify-around my-4">
        <View className="flex-row justify-center mt-40 mb-60">
          <Image source={require("../assets/images/Logo.png")} />
        </View>
        <View>
          <TouchableOpacity className="py-4 mx-4 -mb-10 bg-yellow-500 rounded-xl" onPress={() => navigation.navigate('SignUp')}>
            <Text className="text-2xl font-bold text-center text-gray-900">Sign Up</Text>
          </TouchableOpacity>
        </View>
        <View className="flex-row justify-center">
          <Text className="text-lg font-semibold">Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text className="text-lg font-semibold text-yellow-400">Log In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
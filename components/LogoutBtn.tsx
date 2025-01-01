import { useEffect, useState } from 'react';
import { auth } from "@/firebaseConfig";
import { Link } from "expo-router";
import { View, StyleSheet } from "react-native";
import { useRouter } from 'expo-router';

import * as FileSystem from 'expo-file-system';

export default function LogoutBtn({ text = 'Voltar' }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const router = useRouter();

  const deleteFile = async () => {
    try {
      await FileSystem.deleteAsync(`${FileSystem.documentDirectory}login.txt`);
    } catch (error) {
      console.error("Erro ao excluir o arquivo:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsAuthenticated(!!user);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    deleteFile();
    if (isAuthenticated) {
      auth.signOut().catch((error) => {
        alert('Erro ao fazer logout: ' + error.message);
      });
    }
  };

  return (
    <View style={{ width: '25%', display: 'flex', alignSelf: 'flex-end' }}>
      <Link style={[styles.logoutBtn]} href={'../'} onPress={() => {
        router.push('../');
        handleLogout();
      }}>
        {text}
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  logoutBtn: {
    padding: 5,
    backgroundColor: "#E3371E",
    borderRadius: 5,
    color: "#FFF",
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  }
});
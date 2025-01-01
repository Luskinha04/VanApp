import Banner from "@/components/Banner";
import { View, Text, TextInput, StyleSheet, Pressable, Image, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";

import { auth, db } from "@/firebaseConfig";
import { onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { Checkbox } from "react-native-paper";
import { setPersistence, browserLocalPersistence } from "firebase/auth";

import * as FileSystem from 'expo-file-system';

import lock from "@/image/login/lock.png";
import perfil from "@/image/login/perfil.png";
import eyeIcon from '@/assets/images/eyeIcon.png';
import eyeOffIcon from '@/assets/images/eyeOffIcon.png';
import Header from "@/components/Header";

export default function login() {
  const [login, setLogin] = useState({
    email: "",
    password: "",
  });
  const [isChecked, setChecked] = useState(false);
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [isDisabled, setDisabled] = useState(false);
  const [id, setId] = useState<string | undefined>();

  const { type } = useLocalSearchParams();
  const router = useRouter();

  function getRoute(type: string) {
    const route = type === "admin"
      ? "/auth/admin"
      : type === "aluno"
        ? "/auth/aluno"
        : "/auth/motorista";
    return route;
  }

  const createFile = async () => {
    try {
      const fileUri = `${FileSystem.documentDirectory}login.txt`;
      await FileSystem.writeAsStringAsync(fileUri,
        `${login.email} ${login.password}`
        , { encoding: FileSystem.EncodingType.UTF8 });
      console.log('File created!');
      console.log(login.email, login.password);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const checkKeeping = async () => {
      try {
        const keepLogged = await FileSystem.readAsStringAsync(`${FileSystem.documentDirectory}login.txt`);
        // Verifica se o usuário escolheu manter o login
        if (keepLogged != '') {
          const [email, password] = keepLogged.split(' ');
          handleLogin(email, password);
        }
      } catch (error) {
        console.error('Error checking keepLogged:', error);
      }
    };

    checkKeeping();
  }, []);

  function keepLogged() {
    setPersistence(auth, browserLocalPersistence);
    createFile();
  }

  function handleLogin(email: string, password: string) {
    console.log('email:', email, 'password:', password);
    setDisabled(true);
    if (type === 'admin' && login.email != "a@admin.com" && login.password != "admin@") {
      alert('Usuário ou senha inválidos');
      setDisabled(false);
      return;
    }
    //testes
    // admin: admin@admin.com admin@ (admin@admin)
    // aluno: a@aluno.com 123456
    // motorista: m@motorista.com 123456
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        onAuthStateChanged(auth, async (user) => {
          setId(user?.uid);
          if (user) {
            const ref = doc(db, 'users', user.uid);
            const docSnap = await getDoc(ref);
            if (docSnap.exists()) {
              if (docSnap.data().type == type) {
                router.push({
                  pathname: getRoute(Array.isArray(type) ? type[0] : type),
                  params: { type },
                });
                setDisabled(false);
                return;
              }
            } else {
              alert('Tipo de usuário não autorizado');
              setDisabled(false);
            }
          }
        });
      })
      .catch(() => {
        alert('Usuário ou senha inválidos');
        setDisabled(false);
      });
  }

  return (
    <>
      <Header title={`Login do ${type}`} text="Voltar" />
      <View
        style={{
          width: "100%",
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Banner />
        <View style={[styles.box]}>
          <View style={[styles.boxInside]}>
            <Text style={[styles.textPlaceholder]}>Login</Text>
            <View style={[styles.boxPlaceholder]}>
              <Image source={perfil} style={[styles.icon]} />
              <TextInput
                style={[styles.placeholder]}
                onChangeText={text => setLogin({ ...login, email: text })}
                value={login.email}
              />
            </View>
          </View>
          <View style={[styles.boxInside]}>
            <Text style={[styles.textPlaceholder]}>Senha</Text>
            <View style={[styles.boxPlaceholder]}>
              <Image source={lock} style={[styles.icon]} />
              <TextInput
                style={[styles.placeholder]}
                onChangeText={(text) => setLogin({ ...login, password: text })}
                value={login.password}
                secureTextEntry={!isPasswordVisible} // Controla a visibilidade da senha
              />
              <TouchableOpacity
                style={styles.toggleButton}
                onPress={() => setPasswordVisible(!isPasswordVisible)}
              >
                <Image
                  source={isPasswordVisible ? eyeIcon : eyeOffIcon} // Alterna entre os ícones
                  style={styles.icon}
                />
              </TouchableOpacity>
            </View>
          </View>
          {type != 'admin' &&
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Checkbox
                status={isChecked ? "checked" : "unchecked"}
                onPress={() => {
                  setChecked(!isChecked);
                  if (!isChecked) {
                    keepLogged();
                  } else {
                    try {
                      FileSystem.deleteAsync(`${FileSystem.documentDirectory}login.txt`);
                    } catch (error) {
                      console.error("Erro ao excluir o arquivo:", error);
                    }
                  }
                }}
              />
              <Text>Manter conectado</Text>
            </View>}
          {isDisabled ?
            <View style={[styles.boxBtn, { backgroundColor: '#A6A6A6' }]}>
              <Pressable style={{ width: '100%' }}>
                <Text style={styles.btnText}>
                  Acessar
                </Text>
              </Pressable>
            </View>
            :
            <View style={[styles.boxBtn]}>
              <Pressable style={{ width: '100%' }} onPress={() => handleLogin(login.email, login.password)}>
                <Text style={styles.btnText}>
                  Acessar
                </Text>
              </Pressable>
            </View>
          }
        </View>

      </View>
    </>
  );
}

const styles = StyleSheet.create({
  box: {
    width: "90%",
    height: "40%",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "space-evenly",
    margin: 10,
  },
  boxInside: {
    width: "90%",
  },
  placeholder: {
    backgroundColor: "#A6A6A6",
    height: 40,
    borderRadius: 10,
    width: '90%',
    color: '#FFF',
    paddingLeft: 10,
  },
  boxBtn: {
    display: 'flex',
    width: '60%',
    maxWidth: '80%',
    alignItems: 'center',
    backgroundColor: '#32A62E',
    padding: 10,
    borderRadius: 10,
    marginTop: 5,
    color: '#FFF',
    boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
  },
  btnText: {
    color: '#FFF',
    textAlign: 'center',
  },
  boxPlaceholder: {
    marginTop: 5,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  textPlaceholder: {
    marginLeft: 30,
  },
  icon: {
    width: 25,
    height: 25,
  },
  toggleButton: {
    padding: 5,

  },
});


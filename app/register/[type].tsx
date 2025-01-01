import Banner from "@/components/Banner";
import { FormInput } from "@/components/FormInput";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { View, Text, TextInput, StyleSheet, ScrollView, ImageSourcePropType, TouchableOpacity } from "react-native";
import { auth, firestore } from "@/firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";

import { doc, setDoc } from "firebase/firestore";

import perfil from "@/image/login/perfil.png";
import lock from "@/image/login/lock.png";
import Header from "@/components/Header";
import { useRouter } from "expo-router";

export default function register() {

  const [data, setData] = useState<{ [key: string]: string; }>({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    phone: "",
    address: "",
    number: "",
    complement: "",
  });

  const [loading, setLoading] = useState<'none' | 'flex'>('none');
  const [modalVisible, setModalVisible] = useState<'none' | 'flex'>('none');

  const router = useRouter();

  const fields: { name: string; key: string; image: ImageSourcePropType; }[] = [
    { name: "Nome Completo", key: "name", image: perfil },
    { name: "Telefone", key: "phone", image: perfil },
    { name: "E-mail", key: "email", image: perfil },
    { name: "Senha", key: "password", image: lock },
    { name: "Confirme a senha", key: "confirmPassword", image: lock },
  ];

  const { type } = useLocalSearchParams();

  if (type === 'aluno') {
    fields.push(
      { name: "Endereço", key: "address", image: perfil },
      { name: "Número", key: "number", image: perfil },
      { name: "Complemento", key: "complement", image: perfil },
    );
  }

  const registerUser = async (data: { email: string; password: string;[key: string]: string; }) => {
    setLoading('flex');
    const { email, password } = data;
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userDocRef = doc(firestore, 'users', user.uid);
      await setDoc(userDocRef, {
        name: data.name,
        phone: data.phone,
        address: data.address,
        number: data.number,
        complement: data.complement,
        email: email,
        type: type
      });

      const tripDocRef = doc(firestore, 'viagens', user.uid);
      await setDoc(tripDocRef, {
        name: data.name,
        type: type,
        value: '',
      });

      router.push(`/register/${type}`);

      setData({
        email: '',
        password: '',
        name: '',
        phone: '',
        address: '',
        number: '',
        complement: '',
        confirmPassword: ''
      });
      setLoading('none');
      alert('Usuário cadastrado com sucesso');
    } catch (error) {
      console.error('Erro ao registrar usuário:', error);
      setLoading('none');
    }
  };

  return (
    <>
      <ScrollView
        style={{
          width: "100%",
        }}
      >
        <Header title={`Cadastrar ${type}s`} text="Voltar" link={"/auth/admin?type=admin"} />
        <Banner />
        <View style={[styles.box]}>
          <Text>
            Preencha os campos com as informações do {type}.
          </Text>
          <View>
            {fields.map(({ key, name, image }, index) => (
              <FormInput key={index} name={name} image={image}>
                <TextInput
                  style={[styles.placeholder]}
                  onChangeText={text => setData({ ...data, [key]: text })}
                  value={data[key]}
                />
              </FormInput>
            ))}
          </View>
          {(data.password !== data.confirmPassword || data.confirmPassword == '') ?
            <View style={[styles.boxBtn, { backgroundColor: "#A6A6A6" }]}>
              <TouchableOpacity onPress={() => alert('Senhas não Correspondentes')}>
                <Text style={styles.btnText}>
                  Cadastrar
                </Text>
              </TouchableOpacity>
            </View>
            :
            <View style={[styles.boxBtn]}>
              <TouchableOpacity onPress={() => registerUser({ ...data, email: data.email, password: data.password })}>
                <Text style={styles.btnText}>
                  Cadastrar
                </Text>
              </TouchableOpacity>
            </View>
          }
        </View>
      </ScrollView >
      <View style={[styles.boxLoading, { display: loading }]}>
        <Text style={{ fontSize: 22, fontWeight: 'bold' }}>
          Cadastrando...
        </Text>
      </View>
      <View style={[styles.boxLoading, { display: modalVisible }]}>
        <Text style={{ fontSize: 22, fontWeight: 'bold' }}>
          Cadastrado com sucesso
        </Text>
        <TouchableOpacity style={[styles.boxBtn]} onPress={() => setModalVisible('none')}>
          <Text>Fechar</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  box: {
    marginVertical: 10,
    margin: 'auto',
    maxWidth: '90%',
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
    marginVertical: 20,
    margin: 'auto',
    color: '#FFF',
    boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
  },
  btnText: {
    color: '#FFF',
  },
  boxLoading: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    backgroundColor: "#FFF",
    overflowY: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    width: '100%',
    height: 40,
  },
  textStyle: {
    padding: 10,
    color: '#000',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modal: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 10,
    boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
    margin: 'auto',
    width: '90%',
    height: '30%',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
});


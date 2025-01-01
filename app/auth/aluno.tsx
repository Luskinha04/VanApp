import Banner from "@/components/Banner";
import { ScrollView, Text, View, StyleSheet, TouchableOpacity, Modal, Alert, Pressable } from "react-native";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db, firestore } from "@/firebaseConfig";
import { RadioButton } from 'react-native-paper';
import Header from "@/components/Header";

export default function aluno() {
  const auth = getAuth();
  const [fetchData, setFetchData] = useState<UserData>({});
  const [checked, setChecked] = useState('first');
  const [id, setId] = useState('');
  const [fetchDataUnique, setFetchDataUnique] = useState<userDataUnique>({});

  const [modalVisible, setModalVisible] = useState(false);

  interface UserData {
    name?: string;
    type?: string;
    phone?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    address?: string;
    number?: string;
    complement?: string;
  }

  interface userDataUnique {
    name?: string;
    type?: string;
    value?: string;
    date?: string;
  }

  const todayFormatted = new Date().getDate() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getFullYear();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const ref = doc(db, `viagens/${id}`, "");
        const docSnap = await getDoc(ref);
        if (docSnap.exists()) {
          setFetchDataUnique(docSnap.data());
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [modalVisible, fetchData]);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("User is signed in.: " + user.uid);
        setId(user.uid);
        const ref = doc(db, 'users', user.uid);

        const fetchData = async () => {
          const docSnap = await getDoc(ref);
          if (docSnap.exists()) {
            setFetchData(docSnap.data());
          } else {
            console.log("No such document!");
          }
        };
        fetchData();
      } else {
        console.log("No user is signed in.");
      }
    });
  }, []);

  const options = [
    { text: "Vou e Volto", value: "first" },
    { text: "Hoje não Vou", value: "second" },
    { text: "Somente Irei", value: "third" },
    { text: "Somente Voltarei", value: "fourth" },
  ];

  const registerViagem = async () => {
    try {
      const newRegister = {
        name: fetchData?.name,
        type: fetchData?.type,
        value: checked,
        date: todayFormatted,
      };
      const userDocRef = doc(firestore, `viagens/${id}`);
      await setDoc(userDocRef, newRegister);
      alert('registrado com sucesso');
    } catch (error) {
      console.error(error);
    }
  };

  const today = new Date().getDate() + '/' + (new Date().getMonth() + 1) + '/' + new Date().getFullYear();
  const todayFormat = new Date().getDate() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getFullYear();

  return (
    <ScrollView
      style={{
        width: "100%",
        height: "100%",
        paddingTop: 5
      }}
    >

      <Header title={`Bem Vindo ${fetchData.name}!`} text="Voltar" />
      <Banner />
      <ScrollView style={[styles.container]}>
        <View style={[styles.box]}>
          <View style={[styles.boxDate]}>
            <Text style={[styles.textDate, { fontSize: 24 }]}>Data de Hoje:</Text>
            <Text style={[styles.textDate]}>{today}</Text>
          </View>
          <Text style={{ marginTop: 20 }}>Sua Escolha ate o momento:</Text>
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#000', borderWidth: 1, padding: 2, borderRadius: 5, marginTop: 5 }}>
            {fetchDataUnique?.date === todayFormat ? options.find(option => option.value === fetchDataUnique.value)?.text : 'Nenhuma escolha feita'}
          </Text>
        </View>
        <Text style={[{ fontSize: 22, textAlign: 'center' }]} >Marque a opção desejada</Text>
        {options.map((option, index) =>
          <View style={[styles.radioBox]} key={index}>
            <RadioButton
              value={option.value}
              status={checked === option.value ? 'checked' : 'unchecked'}
              onPress={() => setChecked(option.value)}
              color="#000"
            />
            <Text style={[styles.textRadio]}>{option.text}</Text>
          </View>
        )}
        <View style={[styles.boxBtn]}>
          <TouchableOpacity onPress={() => setModalVisible(!modalVisible)}>
            <Text style={styles.btnText}>
              Cadastrar
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={[styles.box]}>
              <View style={[styles.boxDate]}>
                <Text style={[styles.textDate, { fontSize: 24 }]}>Data de Hoje:</Text>
                <Text style={[styles.textDate]}>{today}</Text>
              </View>
            </View>

            <View>
              <Text style={[styles.modalText, { marginTop: 10, color: '#FFF' }]}>Sua escolha:</Text>
              <View style={[styles.boxChoice]}>
                <Text style={[styles.modalText, { color: '#FFF' }]}>
                  {options.find(option => option.value === checked)?.text}
                </Text>
              </View>
            </View>

            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around', width: '100%' }}>
              <View style={[styles.boxBtnModal]}>
                <TouchableOpacity onPress={() => {
                  registerViagem();
                  setModalVisible(!modalVisible);
                }}>
                  <Text style={styles.btnText}>
                    Confirmar
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={[styles.boxBtnModal, { backgroundColor: '#E3371E' }]}>
                <TouchableOpacity onPress={() => {
                  setModalVisible(!modalVisible);
                }}>
                  <Text style={styles.btnText}>
                    Cancelar
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView >
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    margin: 'auto',
  },
  box: {
    marginVertical: 2,
    margin: 'auto',
    maxWidth: '90%',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textDate: {
    fontSize: 20,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#FFF',
  },
  boxDate: {
    width: '80%',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    borderWidth: 1,
    borderColor: '#000',
    margin: 'auto',
    boxShadow: '0 0 10px #A0A6A6',
    backgroundColor: '#A0A6A6',
  },
  radioBox: {
    width: '70%',
    flexDirection: 'row',
    alignItems: 'center',
    margin: 'auto',
    backgroundColor: '#A0A6A6',
    marginVertical: 2,
    padding: 5,
    borderRadius: 10,
  },
  textRadio: {
    width: '100%',
    fontSize: 18,
    color: '#FFF',
    marginLeft: 30,
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
  centeredView: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  modalView: {
    width: '90%',
    height: '40%',
    margin: 20,
    backgroundColor: '#A6A6A6',
    borderRadius: 20,
    borderWidth: 3,
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonDelete: {
    backgroundColor: '#E3371E',
  },
  buttonClose: {
    backgroundColor: '#32A62E',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: 'center',
  },
  modalBtnBox: {
    display: "flex",
    justifyContent: "space-around",
    flexDirection: "row",
    width: '100%',
    paddingVertical: 5
  },
  boxBtnModal: {
    display: 'flex',
    width: '40%',
    maxWidth: '80%',
    alignItems: 'center',
    backgroundColor: '#32A62E',
    padding: 10,
    borderRadius: 10,
    marginVertical: 20,
    margin: 'auto',
    color: '#FFF',
  },
  boxChoice: {
    paddingTop: 11,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    borderWidth: 1,
    borderColor: '#000',
    margin: 'auto',
    boxShadow: '0 0 10px #A0A6A6',
    backgroundColor: '#A0A6A6',
  }
});


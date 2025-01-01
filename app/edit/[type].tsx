import Banner from "@/components/Banner";
import { Link, Stack, useLocalSearchParams } from "expo-router";
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Alert, Modal, Pressable } from "react-native";
import { collection, DocumentData, getDocs, QueryDocumentSnapshot, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import { useEffect, useState } from "react";
import Header from "@/components/Header";

export default function edit() {
  const { type } = useLocalSearchParams();
  const [data, setData] = useState<QueryDocumentSnapshot<DocumentData>[] | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedName, setSelectedName] = useState('');
  const [selectedId, setSelectedId] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      if (typeof type === 'string') {
        const querySnapshot = await getDocs(collection(db, 'users'));
        const filteredDocs: QueryDocumentSnapshot<DocumentData>[] = [];
        querySnapshot.forEach((doc) => {
          if (doc.data().type === type) {
            filteredDocs.push(doc);
          }
        });
        setData(filteredDocs);
      }
    };
    fetchData();
  }, [type, modalVisible]);

  const typeFormatted = type[0].toUpperCase() + type.slice(1);

  const deleteUserById = async (id: string) => {
    await deleteDoc(doc(db, 'users', id));
    setModalVisible(!modalVisible);
  };

  return (
    <>
      <Header title={`Editar ${type}s`} text="Voltar" link="/auth/admin?type=admin" />
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
          <Text style={[styles.title]}>{typeFormatted}s Cadastrados</Text>
          <ScrollView>
            {data?.map((doc) => {
              return (
                <View key={doc.id} style={[styles.line]}>
                  <Text style={[styles.name]}>{doc.data().name.length > 15 ? doc.data().name.substring(0, 10) + '...' : doc.data().name}</Text>
                  <View style={[styles.btnBox]}>
                    <TouchableOpacity style={[styles.btn, { backgroundColor: '#32A62E' }]}>
                      <Link href={{
                        pathname: `/editById/[id]`,
                        params: { id: doc.id }
                      }}>
                        <Text style={[styles.textBtn]}>Editar</Text>
                      </Link>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.btn, { backgroundColor: '#E3371E' }]} onPress={() => {
                      setSelectedName(doc.data().name);
                      setModalVisible(!modalVisible);
                      setSelectedId(doc.id);
                    }}>
                      <Text style={[styles.textBtn]}>Excluir</Text>
                    </TouchableOpacity>

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
                          <Text style={styles.modalText}>Tem certeza que deseja excluir</Text>
                          <Text style={styles.modalText}>{selectedName}?</Text>
                          <View style={[styles.modalBtnBox]}>
                            <Pressable
                              style={[styles.button, styles.buttonClose]}
                              onPress={() => {
                                setModalVisible(!modalVisible);

                              }}>
                              <Text style={styles.textStyle}>Cancelar</Text>
                            </Pressable>
                            <Pressable
                              style={[styles.button, styles.buttonDelete]}
                              onPress={() => deleteUserById(selectedId)}>
                              <Text style={styles.textStyle}>Excluir</Text>
                            </Pressable>
                          </View>
                        </View>
                      </View>
                    </Modal>

                  </View>
                </View>
              );
            })}
          </ScrollView>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  box: {
    backgroundColor: "#A6A6A6",
    width: "90%",
    padding: 10,
    height: "70%",
    borderRadius: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  line: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#000",
    paddingVertical: 5,
    paddingLeft: 5,
  },
  name: {
    fontSize: 18,
    textAlign: "left",
  },
  btnBox: {
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "row",
    borderLeftWidth: 2,
    borderColor: "#000",
    width: '42%',
    height: '100%',
    paddingVertical: 5
  },
  modalBtnBox: {
    display: "flex",
    justifyContent: "space-around",
    flexDirection: "row",
    width: '100%',
    paddingVertical: 5
  },
  btn: {
    width: 50,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    margin: 5,

  },
  textBtn: {
    color: "#fff",
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
    backgroundColor: 'white',
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#E3371E',
    padding: 35,
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
    marginBottom: 15,
    textAlign: 'center',
  },
});
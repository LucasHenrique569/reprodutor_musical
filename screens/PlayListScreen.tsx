import React, { use, useEffect, useState } from "react";
import {
  Touchable,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  FlatList,
} from "react-native";
import { carregarDados } from "../config/database";
import { Audio } from "expo-av";
import { useStateForPath } from "@react-navigation/native";

import { FontAwesome as Icon } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";


export default function PlayListScreen() {

  const [lista, setLista] = useState<any[]>([]);
  const [som, setSom] = useState<Audio.Sound | null>(null);
  const [incremento, setIncremento] = useState(0);
  const [tocando, setTocando] = useState(false);

  useEffect(() => {
    const buscarMusicas = async () => {
      const resposta = await carregarDados();
      setLista(resposta);
    };
    buscarMusicas();
  }, []);

  useEffect(() => {
    return () => {
      if (som) som.unloadAsync();
    };
  }, [som]);

  const tocar = async (uri: string) => {
    try {
      if (som) {
        if (tocando) {
          await som.pauseAsync();
          setTocando(false)
        } else {
          await som.playAsync();
          setTocando(true);
        }
      } else {
        const { sound } = await Audio.Sound.createAsync({ uri });
        setSom(sound);
        setTocando(true);
        await sound.playAsync();
      }
    } catch (error) {
      console.error("Erro ao tocar áudio:", error);
    }
  };

  const proxima = async () => {
    try {
      if (som) {
        await som.unloadAsync();
        setSom(null);
        setTocando(false);
      }
      const proximoIndex = (incremento + 1) % lista.length;
      setIncremento(proximoIndex);
      const { sound } = await Audio.Sound.createAsync({ uri: lista[proximoIndex].uri });
      setSom(sound);
      await sound.playAsync();
      setTocando(true)

    } catch (error) {
      console.error("Erro ao trocar música:", error);
    }
  };

  const anterior = async () => {
    try {
      if (som) {
        await som.unloadAsync();
        setSom(null);
        setTocando(false);
      }

      let anteriorIndex = 0;

      if (incremento === 0) {
        setIncremento(lista.length - 1);
        anteriorIndex = lista.length - 1;
      }
      else {
        anteriorIndex = (incremento - 1) % lista.length;
        setIncremento(anteriorIndex);
      }

      const { sound } = await Audio.Sound.createAsync({ uri: lista[anteriorIndex].uri });
      setSom(sound);
      await sound.playAsync();
      setTocando(true)

    } catch (error) {
      console.error("Erro ao trocar música:", error);
    }
  };

  function generateRandomNumber(min, max) {
    let variavel = Math.floor(Math.random() * (max - min) + min)
    console.log(variavel)
    return variavel
  }

  if (lista.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Você não selecionou nenhuma música</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>

      <FlatList
        data={lista}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <TouchableOpacity

              onPress={async() => {
                try {
                  if (som) {
                    await som.unloadAsync();
                    setSom(null);
                    setTocando(false);
                  }
                  const { sound } = await Audio.Sound.createAsync({ uri: lista[item.id-1].uri });
                  setSom(sound);
                  await sound.playAsync();
                  setTocando(true)

                } catch (error) {
                  console.error("Erro ao tocar música:", error);
                }
                
                setIncremento(item.id - 1)
              }}
            >

              {incremento === item.id - 1
                ?
                <Text style={{color: "rgba(247, 131, 43, 1)", fontWeight: "bold", textDecorationLine: "underline"}} >{item.nome}</Text>
                :
                <Text style={{color: "#000", fontWeight: "500"}}>{item.nome}</Text>

              }

            </TouchableOpacity>
          </View>
        )}

      />


      <View style={styles.buttonsContainer}>
        <TouchableOpacity 
          style={styles.buttonPlay} 
          onPress={async () => {
                let randomMusic = generateRandomNumber(0, lista.length)

                try {
                  if (som) {
                    await som.unloadAsync();
                    setSom(null);
                    setTocando(false);
                  }

                  const { sound } = await Audio.Sound.createAsync({ uri: lista[randomMusic].uri });
                  setSom(sound);
                  await sound.playAsync();
                  setTocando(true)

                  setIncremento(randomMusic)
                } catch (error) {
                  console.error("Erro ao tocar música:", error);
                }
                
              }}
        >
          <Icon name="random" size={20} color="#000" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttonPrev} onPress={anterior}>
          <Feather name="skip-back" size={20} color="#000" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttonPlay} onPress={() => tocar(lista[incremento].uri)}>
          {tocando
            ?
            <View style={styles.view}>
              <Feather name="pause" size={20} color={"black"} />
              <Text>Pausar</Text>
            </View>
            :
            <View style={styles.view}>
              <Feather name="play" size={20} color={"black"} />
              <Text>Play</Text>
            </View>
          }
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.buttonNext} onPress={proxima}>
          <Feather name="skip-forward" size={20} color="#000" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

export const styles = StyleSheet.create({
  container: {
    display: "flex",
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 100,
    gap: 10,
  },
  buttonPrev: {
    padding: 20,
    backgroundColor: "#ccc",
    borderRadius: 10,
  },
  buttonPlay: {
    padding: 20,
    backgroundColor: "#ccc",
    borderRadius: 10,
  },
  buttonNext: {
    padding: 20,
    backgroundColor: "#ccc",
    borderRadius: 10,
  },
  texto: {
    fontSize: 16,
    color: "#333",
    fontWeight: "600",
    textAlign: "center",
  },
  view: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row"

  },
  listContainer: {
    paddingBottom: 20,
    marginTop: '5%',
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  buttonsContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 10,
    width: '70%',
    gap: 10,
  },
  playRandomMusicButton: {
    backgroundColor: "#ccc",
    padding: 20,
    borderRadius: 10
  }
});

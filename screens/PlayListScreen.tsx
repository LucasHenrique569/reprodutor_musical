import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  FlatList,
} from "react-native";
import { Audio } from "expo-av";
import { carregarDados } from "../config/database";


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
          setTocando(false);
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
      console.error(error);
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
      const { sound } = await Audio.Sound.createAsync({
        uri: lista[proximoIndex].uri,
      });
      setSom(sound);
      await sound.playAsync();
      setTocando(true);
    } catch (error) {
      console.error(error);
    }
  };

  if (lista.length === 0) {
    return (
      <View style={styles.containerNotMusics}>
        <Text style={styles.textoAviso}>Não existem músicas.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={lista}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Text style={styles.itemLista}>{item.nome}</Text>
        )}
        contentContainerStyle={{ padding: 16 }}
        style={{ flex: 1, width: "100%" }}
      />
      <View style={styles.containerBotoes}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => tocar(lista[incremento].uri)}
        >
          <Text style={styles.texto}>{tocando ? "⏸ Pause" : "▶ Play"}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={proxima}>
          <Text style={styles.texto}>⏭ Próxima</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    alignItems: "center",
  },
  containerNotMusics: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  textoAviso: {
    fontSize: 18,
    color: "#333",
    textAlign: "center",
  },
  itemLista: {
    fontSize: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    color: "#333",
    width: "100%",
  },
  containerBotoes: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
    padding: 16,
    marginBottom: 50
  },
  button: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: "#ccc",
    borderRadius: 10,
  },
  texto: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
  },
});

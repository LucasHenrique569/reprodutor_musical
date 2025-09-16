import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";

import { inserir, remover, limparBanco } from "../config/database";

export default function Home({ navigation }) {
    
  const [musicas, setMusicas] = useState([]);

  const escolherMusica = async () => {
    const resultado = await DocumentPicker.getDocumentAsync({
      type: "audio/*",
      copyToCacheDirectory: true,
      multiple: true,
    });

    if (!resultado.canceled) {
      const selecionadas = resultado.assets.map((arq) => ({
        id: arq.uri,
        nome: arq.name,
        uri: arq.uri,
      }));

      setMusicas([...musicas, ...selecionadas]);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerArea}>
        <Text style={styles.headerTextArea}>Selecione as músicas de sua playlist</Text>
      </View>

      <View style={styles.topArea}>
        <Text style={styles.selectedMusicsText}>Músicas selecionadas</Text>

        <FlatList
          data={musicas}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          renderItem={({ item }) => (
            <View style={styles.listItem}>
              <TouchableOpacity style={styles.musicInfo}>
                <Text style={styles.musicText}>{item.nome}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.removeButton}
                onPress={async () => {
                  await remover(item.id);
                  setMusicas(musicas.filter((musica) => musica.id !== item.id));
                }}
              >
                <Text style={styles.removeButtonText}>➖</Text>
              </TouchableOpacity>
            </View>
          )}
        />
        
        <TouchableOpacity onPress={escolherMusica} style={styles.addButton}>
          <Text style={styles.addButtonText}>Escolher músicas</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.bottomArea}>
        <TouchableOpacity
          style={styles.confirmSelectedMusicsButton}
          onPress={async () => {
            try{
              await limparBanco()
              
              for (const item of musicas){
                await inserir(item.nome, item.uri)
              }
  
              Alert.alert('Músicas adicionadas com sucesso !!! ')
            } catch(erro){
              console.error('Erro ao tentar cadastrar novas músicas: ', erro)
            }
          }}
        >
          <Text style={styles.addButtonText}>Confirmar músicas selecionadas</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate("PlayList")}
          style={styles.checkButton}
        >
          <Text style={styles.addButtonText}>Tocar playlist</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    height: "100%"
  },
  topArea: {
    flex: 1,
    padding: 20,
    backgroundColor: "#B0B0B0"
  },
  bottomArea: {
    padding: 20,
    borderTopWidth: 1,
    backgroundColor: "#505050",
    alignItems: "center",
    marginBottom: 40,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    height: "15%"
  },
  addButton: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 8,
    marginTop: 15,
    alignItems: "center",
  },
  addButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center"
  },
  checkButton: {
    backgroundColor: "#2196F3",
    borderRadius: 8,
    width: "48%",
    height: "80%",
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  listContainer: {
    paddingBottom: 20,
    borderWidth: 10,
    borderRadius: 10,
    borderColor: "#505050"
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
  musicInfo: {
    flex: 1,
  },
  musicText: {
    fontSize: 16,
    color: "#333",
  },
  removeButton: {
    marginLeft: 10,
    backgroundColor: "#E53935",
    borderRadius: 20,
    padding: 8,
  },
  removeButtonText: {
    color: "#FFF",
    fontSize: 16,
  },
  confirmSelectedMusicsButton: {
    backgroundColor: "#4CAF50",
    borderRadius: 8,
    width: "48%",
    height: "80%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  headerArea: {
    height: "10%",
    backgroundColor: "#505050",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  headerTextArea: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FFF"
  },
  selectedMusicsText: {
    textAlign: "center", 
    color: "#FFF", 
    fontWeight: "bold", 
    fontSize: 20, 
    marginBottom: 10
  }
})
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Aplicación de Lista de Tareas en React Native
 *
 * Esta aplicación demuestra los conceptos básicos y algunas funcionalidades avanzadas de React Native.
 *
 * Componentes utilizados:
 * - View: Contenedor principal y para cada tarea.
 * - Text: Para mostrar el título y el texto de las tareas.
 * - TextInput: Para ingresar nuevas tareas.
 * - TouchableOpacity: Para los botones de añadir y eliminar tareas.
 * - FlatList: Para renderizar la lista de tareas de manera eficiente.
 * - ActivityIndicator: Para mostrar un indicador de carga.
 * - Alert: Para mostrar mensajes de confirmación al eliminar tareas.
 *
 * Funcionalidades principales:
 * 1. Añadir tareas: Los usuarios pueden agregar nuevas tareas a la lista.
 * 2. Eliminar tareas: Las tareas pueden ser eliminadas individualmente.
 * 3. Marcar tareas como completadas: Los usuarios pueden tocar una tarea para marcarla como completada.
 * 4. Persistencia de datos: Las tareas se guardan en el almacenamiento local del dispositivo.
 * 5. Carga asíncrona: La aplicación muestra un indicador de carga mientras recupera las tareas guardadas.
 *
 * Conceptos de React y React Native demostrados:
 * - Uso de hooks (useState, useEffect) para manejar el estado y efectos secundarios.
 * - Manejo de eventos como onPress y onChangeText.
 * - Estilizado de componentes utilizando StyleSheet.
 * - Renderizado condicional (para mostrar el indicador de carga).
 * - Uso de interfaces TypeScript para definir la estructura de los datos.
 * - Manejo de operaciones asíncronas con async/await.
 * - Uso de AsyncStorage para la persistencia de datos.
 *
 */


interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

// Definición de estilos para los componentes
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#4c669f',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 5,
    marginBottom: 20,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 10,
    color: '#333',
  },
  addButton: {
    backgroundColor: '#4c669f',
    padding: 10,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  todoList: {
    paddingHorizontal: 20,
  },
  todoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
    elevation: 3,
  },
  todoText: {
    fontSize: 16,
    flex: 1,
    color: '#333',
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#6c757d',
  },
  deleteButton: {
    backgroundColor: '#dc3545',
    padding: 8,
    borderRadius: 15,
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  
});

const App: React.FC = () => {
  // Estados para manejar la lista de tareas, nueva tarea y estado de carga
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  // Efecto para cargar las tareas al iniciar la aplicación
  useEffect(() => {
    loadTodos();
  }, []);

  // Función asíncrona para cargar las tareas desde el almacenamiento local
  const loadTodos = async (): Promise<void> => {
    try {
      const storedTodos = await AsyncStorage.getItem('todos');
      if (storedTodos) {
        setTodos(JSON.parse(storedTodos));
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar las tareas');
    } finally {
      setLoading(false);
    }
  };

  // Función para guardar las tareas en el almacenamiento local
  const saveTodos = async (updatedTodos: Todo[]): Promise<void> => {
    try {
      await AsyncStorage.setItem('todos', JSON.stringify(updatedTodos));
    } catch (error) {
      Alert.alert('Error', 'No se pudieron guardar las tareas');
    }
  };

  // Función para añadir una nueva tarea
  const addTodo = (): void => {
    if (newTodo.trim() !== '') {
      const updatedTodos = [
        ...todos,
        {id: Date.now(), text: newTodo, completed: false},
      ];
      setTodos(updatedTodos);
      saveTodos(updatedTodos);
      setNewTodo('');
    }
  };

  // Función para eliminar una tarea con confirmación
  const removeTodo = (id: number): void => {
    Alert.alert(
      'Confirmar',
      '¿Estás seguro de que quieres eliminar esta tarea?',
      [
        {text: 'Cancelar', style: 'cancel'},
        {
          text: 'Eliminar',
          onPress: () => {
            const updatedTodos = todos.filter(todo => todo.id !== id);
            setTodos(updatedTodos);
            saveTodos(updatedTodos);
          },
        },
      ],
    );
  };

  // Función para marcar una tarea como completada o no
  const toggleTodo = (id: number): void => {
    const updatedTodos = todos.map(todo =>
      todo.id === id ? {...todo, completed: !todo.completed} : todo,
    );
    setTodos(updatedTodos);
    saveTodos(updatedTodos);
  };

  return (
    <View style={styles.container}>
      {/* Encabezado con título y campo de entrada */}
      <View style={styles.header}>
        <Text style={styles.title}>Mis Tareas</Text>
        <View style={styles.inputContainer}>
          {/* Campo de entrada para nueva tarea */}
          <TextInput
            style={styles.input}
            value={newTodo}
            onChangeText={setNewTodo}
            placeholder="Añadir nueva tarea"
            placeholderTextColor="#adb5bd"
          />
          {/* Botón para añadir tarea */}
          <TouchableOpacity style={styles.addButton} onPress={addTodo}>
            <Text style={styles.addButtonText}>Añadir</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Renderizado condicional: indicador de carga o lista de tareas */}
      {loading ? (
        <ActivityIndicator
          size="large"
          color="#4c669f"
          style={{marginTop: 20}}
        />
      ) : (
        <FlatList
          style={styles.todoList}
          data={todos}
          keyExtractor={(item: Todo) => item.id.toString()}
          renderItem={({item}: {item: Todo}) => (
            <TouchableOpacity onPress={() => toggleTodo(item.id)}>
              <View style={styles.todoItem}>
                <Text
                  style={[
                    styles.todoText,
                    item.completed && styles.completedText,
                  ]}>
                  {item.text}
                </Text>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => removeTodo(item.id)}>
                  <Text style={styles.deleteButtonText}>Eliminar</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

export default App;

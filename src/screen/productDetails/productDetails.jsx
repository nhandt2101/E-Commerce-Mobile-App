
import {View, ScrollView, TextInput, Image} from 'react-native';
export default function productDetails({ navigation }) {

    return (
        <ScrollView>
            <View>
            <Image source={{ uri: item.link_img }} style={styles.productImage} />
                <TextInput
                    style={{
                    height: 40,
                    borderColor: 'gray',
                    borderWidth: 1,
                    }}
                    defaultValue="Danh gia san pham"
                />
            </View>
        </ScrollView>
    )
}
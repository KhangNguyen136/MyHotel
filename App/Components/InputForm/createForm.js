import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Formik } from 'formik';
import TextInputCard from '../../Components/InputCard/TextInputCard';
import { Success, CheckInputFailed } from '../AlertMsg/messageAlert'
import Card from '../card';
import { BottomButton, SaveButton } from '../button';
import { addNewRoom, deleteRoom, updateRoom } from '../../Model/roomService';
import LoadingIndicator from '../loadingIndicator';
import { updateListRoom } from '../../Actions/roomActions';
import { useDispatch } from 'react-redux'
import PickerCard from '../InputCard/pickerCard';
import DateTimePickerCard from '../InputCard/dateTimePicker';
import ListGuest from '../Table/listGuest';

export default function CreateForm({ isEdit, item, navigation }) {
    const [loading, setLoading] = React.useState(false)
    const dispatch = useDispatch()
    console.log({ isEdit, item })
    var initValue = { roomName: '', kind: 'A', note: '', price: 0 }
    if (isEdit) {
        initValue = item
        navigation.setOptions({ title: 'Room details' })
    }

    const deleteItem = () => {
        setLoading(true)
        deleteRoom(item.ID,
            () => {
                setLoading(false)
                Success('Deleted room successfully')
                dispatch(updateListRoom())
                navigation.goBack()
            },
            (msg) => {
                setLoading(false)
                CheckInputFailed('Delete room failed', msg)
            })
    }

    const update = (values) => {
        setLoading(true)
        updateRoom(item.ID, values,
            () => {
                setLoading(false)
                Success('Updated room successfully')
                dispatch(updateListRoom())
                navigation.goBack()
            }, (msg) => {
                setLoading(false)
                CheckInputFailed('Update room failed', msg)
            })
    }

    return (
        <Formik initialValues={initValue}
            onSubmit={(values, { resetForm }) => {
                setLoading(true)
                if (!checkInput(values.roomName)) {
                    setLoading(false)
                    return
                }

                addNewRoom(values,
                    () => {
                        setLoading(false)
                        Success('Added room successfully')
                        dispatch(updateListRoom())
                        resetForm()
                    },
                    (msg) => {
                        setLoading(false)
                        CheckInputFailed('Added room failed', msg)
                    })
            }} >
            {({ handleChange, handleBlur, handleSubmit, values, setFieldValue }) => (
                <View>
                    <Card>
                        <PickerCard value={'Select room'} placeholder={'Select room'} onPress={() => navigation.navigate('SelectRoom')} />
                        <DateTimePickerCard date={new Date()} title={'Start date: '} />
                        <TextInputCard value={values.note} onChangeValue={handleChange('note')} onBlur={handleBlur('note')} placeholder={"Note"} />
                        <ListGuest navigation={navigation} />
                        <BottomButton isEditMode={isEdit} onSave={handleSubmit} onDelete={deleteItem} onUpdate={() => update(values)} />
                    </Card>
                    { loading &&
                        <LoadingIndicator />}
                </View>
            )}
        </Formik>
    )
}

function checkInput(roomName) {
    if (roomName == '') {
        CheckInputFailed("Please enter room's name!")
        return false
    }
    return true
}


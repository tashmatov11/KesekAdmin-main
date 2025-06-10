import {
  Button,
  Select,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  ImageListItem,
  OutlinedInput,
  Chip,
  Box
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import FormContainer from "../../components/containers/FormContainer";
import FormPageContainer from "../../components/containers/FormPageContainer";
import useAuth from "../../hooks/useAuth";
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import $api from "../../http/Api";

const popularPlacesIssykKul = [
  {
    name: "Bishkek",
  },
  {
    name: "Osh-city",
  },
  {
    name: "Batken",
  },
  {
    name: "Jalal-Abad",
  },
  {
    name: "Naryn",
  },
  {
    name: "Osh",
  },
  {
    name: "Talas",
  },
  {
    name: "Chyi",
  },
  {
    name: "Yssyk-Kol",
  }
];


function AddOrEditTourPage() {

  const { authData, isLoading } = useAuth()

  const [title, setTitle] = useState('')

  const [to, setTo] = useState("")

  const [numberOfpalce, setPalce] = useState(0)

  const [price, setPrice] = useState(0)

  const [start, setStart] = useState('')

  const [end, setEnd] = useState('')

  const [desc, setDesc] = useState('')

  const [img, setImage] = useState(null)

  const [sightsList, setSightsList] = useState([])


  //for sights
  const [personName, setPersonName] = useState([]);



  const toBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  function formatDate(dateString) {
    const date = new Date(dateString);

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${day}.${month}.${year}`;
  }


  const handleImageChange = async (e) => {
    const res = await toBase64(e.target.files[0])
    setImage(res);
  };

  const data = {
    title: title,
    startDate: formatDate(start),
    endDate: formatDate(end),
    price: Number(price),
    amount: Number(numberOfpalce),
    img: img,
    description: desc,
    location: to,
    isApprove: false,
    user: authData
  }

  const notify = () => toast("Tour saved succesfully!");

  const onSave = async (e, data, personName) => {
    e.preventDefault();
    try {
      const res = await $api.post("tour", data)

      notify();

      await $api.put(`/tour/${res.data.id}`, { ...data, sights: personName })

        .finally(() => {
          setTitle("");
          setStart("");
          setEnd("")
          setPrice(0)
          setImage(null)
          setTo("")
          setDesc("")
          setPersonName([])
          setPalce(0)
        })

    } catch (e) {
      console.error(e);
    }
  };


  const renderCities = useMemo(
    () =>
      popularPlacesIssykKul.map((city) => (
        <MenuItem key={city.name} value={city.name}>
          {city.name}
        </MenuItem>
      )),
    [popularPlacesIssykKul]
  );

  const getSights = async () => {
    try {
      const res = await $api.get("sights")
      setSightsList(res.data)
    } catch (e) {
      console.log("Something went wrong");
    }
  }


  const handleChange = (event) => {
    const { target: { value } } = event;

    const newItems = typeof value === 'string' ? value.split(',') : value;

    const newUniqueItems = newItems.filter(newItem =>
      !personName.some(existingItem => existingItem.id === newItem.id)
    );

    setPersonName([...personName, ...newUniqueItems]);
  };


  useEffect(() => {
    getSights()
  }, [])

  console.log(personName);


  return (
    <FormPageContainer
      isLoading={isLoading}
      title={"Создать тур"}>
      <FormContainer>
        <form onSubmit={(e) => onSave(e, data, personName)}>
          <div className="inputs">
            <FormControl>
              <TextField
                required
                value={title}
                label="Название тура"
                onChange={(e) => setTitle(e.target.value)}
              >
                {/* {renderCities} */}
              </TextField>
            </FormControl>
            <FormControl>
              <InputLabel>Куда</InputLabel>
              <Select
                value={to}
                label="Куда"
                onChange={(e) => setTo(e.target.value)}
                required
              >
                {renderCities}
              </Select>
            </FormControl>
            <TextField
              required
              value={numberOfpalce}
              onChange={(e) => setPalce(e.target.value)}
              label="Кол-во мест"
              variant="outlined"
              type="number"
              inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
            />
            <TextField
              required
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              label="Цена"
              variant="outlined"
              type="number"
              inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
            />
            <LocalizationProvider dateAdapter={AdapterDateFns}>

              <DatePicker
                label="Начало поездки"
                value={start}
                onChange={(newValue) => setStart(newValue)}
                renderInput={(params) => <TextField {...params} required variant="outlined" />}
              />
              <DatePicker
                label="Конец поездки"
                value={end}
                onChange={(newValue) => setEnd(newValue)}
                renderInput={(params) => <TextField {...params} required variant="outlined" />}
              />
            </LocalizationProvider>
            <TextField
              required
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              label="Описание"
              rows={2}
              multiline
              fullWidth
              variant="outlined"
            />
            <Select
              labelId="demo-multiple-chip-label"
              id="demo-multiple-chip"
              multiple
              value={personName}
              onChange={(e) => handleChange(e)}
              input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value.id} label={value.title} />
                  ))}
                </Box>
              )}

            >
              {sightsList.map((name) => (
                <MenuItem
                  key={name.id}
                  value={{ ...name }}
                >
                  {name.title}
                </MenuItem>
              ))}
            </Select>


            <ImageListItem key={img}>
              <img
                src={`${img}`}
                srcSet={`${img}`}
                alt={""}
                loading="lazy"
              />
            </ImageListItem>

            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="image-upload-input"
              type="file"
              onChange={handleImageChange}
            />
            <label htmlFor="image-upload-input" >
              <Button sx={{ width: "100%", height: "100%" }} component="span" variant="outlined" >
                Upload Image
              </Button>
            </label>
          </div>
          <Button type="submit" variant="contained">
            Сохранить
          </Button>
        </form>
      </FormContainer>
    </FormPageContainer>
  );
}

export default AddOrEditTourPage;

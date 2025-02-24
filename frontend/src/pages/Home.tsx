import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import ClearIcon from '@mui/icons-material/Clear';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import styles from '../styles/Home.module.css';

interface Currency {
  name: string;
  value: number;
}

const Home = () => {
  const [amounts, setAmounts] = useState<{ [key: string]: number }>({});
  const [currencyFields, setCurrencyFields] = useState<string[]>(['USD', 'EUR', 'RUB', 'BYN']);
  const [availableCurrencies, setAvailableCurrencies] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const storedAmounts = localStorage.getItem('amounts');
    const storedCurrencies = localStorage.getItem('currencyFields');
    
    if (storedAmounts && storedCurrencies) {
      setAmounts(JSON.parse(storedAmounts));
      setCurrencyFields(JSON.parse(storedCurrencies));
    }
    
    setLoading(true);
    
    axios
      .get<Currency[]>('http://localhost:3000/api/currencies')
      .then((response) => {
        setAvailableCurrencies(response.data.map((currency) => currency.name));
        
        if (!storedAmounts || !storedCurrencies) {
          const initialAmounts: { [key: string]: number } = {};
          response.data.forEach((currency) => {
            initialAmounts[currency.name] = currency.value;
          });
  
          localStorage.setItem('amounts', JSON.stringify(initialAmounts));
          localStorage.setItem('currencyFields', JSON.stringify(['USD', 'EUR', 'RUB', 'BYN']));
          
          setAmounts(initialAmounts);
        }
        
        setLoading(false);
      })
      .catch((error) => {
        setError('Error fetching currencies');
        setLoading(false);
      });
  }, []);
  
  useEffect(() => {
    if (Object.keys(amounts).length > 0 && currencyFields.length > 0) {
      localStorage.setItem('amounts', JSON.stringify(amounts));
      localStorage.setItem('currencyFields', JSON.stringify(currencyFields));
    }
  }, [amounts, currencyFields]); 

  const handleAmountChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    currency: string) => {
    const value = parseFloat(e.target.value);
    if (isNaN(value) || value === 0) {
      setAmounts((prevAmounts) => ({
        ...prevAmounts,
        [currency]: 0,
      }));
      return;
    } else {
      axios
        .post('http://localhost:3000/api/currencies/update', {
          baseCurrency: currency,
          amount: value,
        })
        .then((response) => {
          setAmounts(response.data);
        })
        .catch((error) => console.error(error.response.data, error));
    }
  };

  const handleAddCurrency = (currency: string) => {
    if (!currencyFields.includes(currency)) {
      setCurrencyFields([...currencyFields, currency]);
      setAmounts((prev) => ({
        ...prev,
        [currency]: amounts[currency],
      }));
      setError('');
    } else {
      setError('Currency is already in the list!');
    }
  };

  const handleRemoveCurrency = (currency: string) => {
    setCurrencyFields(currencyFields.filter((c) => c !== currency));
    const updatedAmounts = { ...amounts };
    delete updatedAmounts[currency];
    setAmounts(updatedAmounts);
  };

  return (
    <Container sx={{marginY: 10,}} maxWidth='md' className={styles.container}>
      {error && <Alert sx={{marginY: -8, position: 'absolute'}} severity="error">{error}</Alert>}
      <Typography color='white' fontFamily='Fantasy' variant="h4" gutterBottom>
        ₵urrency ₵onverter
      </Typography>

      <Box display="flex" flexDirection="column" gap={2} className={styles.inputBox}>
        {loading ? (
          <CircularProgress style={{ margin: "20px auto", display: "block" }} />
        ) : (
          <>
            {currencyFields.map((currency) => (
              <Box key={currency} display="flex" alignItems="center">
                <TextField
                  label={currency}
                  type="tel"
                  value={amounts[currency] || ''}
                  onChange={(e) => handleAmountChange(e, currency)}
                  fullWidth
                />
                {!['USD', 'EUR', 'RUB', 'BYN'].includes(currency) && (
                  <IconButton onClick={() => handleRemoveCurrency(currency)} color="error">
                    <ClearIcon />
                  </IconButton>
                )}
              </Box>
            ))}
            <Box mt={2} display="flex" alignItems="center">
              <Select
                value=""
                variant='standard'
                onChange={(e) => handleAddCurrency(e.target.value)}
                displayEmpty
                className={styles.addButton}
                disableUnderline
                IconComponent={() => null}
              >
                <MenuItem value="" disabled>
                  Add Currency
                  <AddCircleIcon sx={{ marginY: '-7px', ml: '5px' }} />
                </MenuItem>
                {availableCurrencies.map((currency) => (
                  <MenuItem key={currency} value={currency}>
                    {currency}
                  </MenuItem>
                ))}
              </Select>
            </Box>
          </>
        )}
      </Box>

      <Box mt={2} display="flex" gap={2}>
        <Button variant="contained" color="secondary" component={Link} to="/currencies">
          <Typography color='white'>
            Currency Table
            <ArrowForwardIosIcon sx={{ marginY: '-7px', ml: '5px' }} />
          </Typography>
        </Button>
      </Box>
    </Container>
  );
};

export default Home;

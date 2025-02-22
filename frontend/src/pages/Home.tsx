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


interface Currency {
  name: string;
  value: number;
}

const Home = () => {
  const [amounts, setAmounts] = useState<{ [key: string]: number }>({});
  const [currencyFields, setCurrencyFields] = useState<string[]>(['USD', 'EUR', 'RUB', 'BYN']);
  const [availableCurrencies, setAvailableCurrencies] = useState<string[]>([]);

  useEffect(() => {
    axios
      .get<Currency[]>('http://localhost:3000/api/currencies')
      .then((response) => {
        setAvailableCurrencies(response.data.map((currency) => currency.name));

        const initialAmounts: { [key: string]: number } = {};
        response.data.forEach((currency) => {
          initialAmounts[currency.name] = currency.value;
        });
        setAmounts(initialAmounts);
      })
      .catch((error) => console.error('Error fetching currencies:', error));
  }, []);

  const handleAmountChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    currency: string) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value)) {
      axios
        .post('http://localhost:3000/api/currencies/update', {
          baseCurrency: currency,
          amount: value,
        })
        .then((response) => {
          setAmounts(response.data);
        })
        .catch((error) => console.error('Error converting currencies:', error));
    }
  };

  const handleAddCurrency = (currency: string) => {
    if (!currencyFields.includes(currency)) {
      setCurrencyFields([...currencyFields, currency]);
      setAmounts((prev) => ({
        ...prev,
        [currency]: amounts[currency],
      }));
    } else {
      console.log('Currency is already in the list!');
      // TODO Render error message
    }
  };

  const handleRemoveCurrency = (currency: string) => {
    setCurrencyFields(currencyFields.filter((c) => c !== currency));
    const updatedAmounts = { ...amounts };
    delete updatedAmounts[currency];
    setAmounts(updatedAmounts);
  };

  return (
    <Container maxWidth='md'>
      <Typography variant="h4" gutterBottom>
        Currency Converter
      </Typography>

      <Box display="flex" flexDirection="column" gap={2}>
        {currencyFields.map((currency) => (
          <Box key={currency} display="flex" alignItems="center" gap={2}>
            <TextField
              label={currency}
              type="number"
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
      </Box>

      <Box mt={2} display="flex" alignItems="center" gap={2}>
        <Select
          value=""
          onChange={(e) => handleAddCurrency(e.target.value)}
          displayEmpty
        >
          <MenuItem value="" disabled>
            Add Currency
          </MenuItem>
          {availableCurrencies.map((currency) => (
            <MenuItem key={currency} value={currency}>
              {currency}
            </MenuItem>
          ))}
        </Select>
      </Box>

      <Box mt={2} display="flex" gap={2}>
        <Button variant="outlined" color="secondary" component={Link} to="/currencies">
          Go to Currencies Table
        </Button>
      </Box>
    </Container>
  );
};

export default Home;

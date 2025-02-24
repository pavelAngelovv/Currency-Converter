import { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import axios from "axios";
import Container from '@mui/material/Container';
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TableSortLabel from "@mui/material/TableSortLabel";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';

interface Currency {
  name: string;
  value: number;
}

const CurrencyTable = () => {
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [sortBy, setSortBy] = useState<string>("name");
  const [order, setOrder] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    const fetchSortedCurrencies = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:3000/api/currencies/sorted?sortBy=${sortBy}&order=${order}`);
        setCurrencies(response.data);
      } catch (error) {
        console.error("Error fetching sorted currencies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSortedCurrencies();
  }, [sortBy, order]);

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setOrder(order === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setOrder("asc");
    }
  };

  return (
    <Container>
      <Box mt={6} display="flex" gap={2}>
        <Button variant="contained" color="secondary" component={Link} to="/">
          <Typography color='white'>
            <ArrowBackIosNewIcon sx={{ marginY: '-7px', mr: '5px' }} />
            Converter
          </Typography>
        </Button>
      </Box>
      <TableContainer sx={{ mt: '20px', mb: '50px' }} component={Paper}>
        {loading ? (
          <CircularProgress style={{ margin: "20px auto", display: "block" }} />
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <TableSortLabel active={sortBy === "name"} direction={order} onClick={() => handleSort("name")}>
                    Currency
                  </TableSortLabel>
                </TableCell>
                <TableCell align="right">
                  <TableSortLabel active={sortBy === "value"} direction={order} onClick={() => handleSort("value")}>
                    Value (per USD)
                  </TableSortLabel>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currencies.map((currency) => (
                <TableRow key={currency.name}>
                  <TableCell>{currency.name}</TableCell>
                  <TableCell align="right">
                    {parseFloat(currency.value.toFixed(10)).toString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </TableContainer>
    </Container>
  );
};

export default CurrencyTable;

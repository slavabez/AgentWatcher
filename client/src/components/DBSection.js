import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";

const API_URL = `/api/names`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Table = styled.table`
  min-width: 80%;
  text-align: center;

  tr:nth-child(even) {
    background-color: #ddd;
  }
`;

const TableHead = styled.thead`
  font-size: 1rem;

  tr {
    font-size: 1rem;
    background-color: #ddd;
    height: 3rem;
  }
`;

const Input = styled.input`
  width: 90%;
  text-align: center;
  font-size: 1rem;
  font-family: "Roboto", sans-serif;
`;

const EditableRow = ({ id, path, name }) => {
  const [isLoading, setLoading] = useState(false);
  const [isEditMode, setEditMode] = useState(false);
  const [newName, setName] = useState(name);

  const updateName = async (id, newName) => {
    setLoading(true);
    const res = await axios.put(`${API_URL}/${id}`, { name: newName });
    console.log(res);
    if (res.status === 200) {
      setName(res.data.name);
      setEditMode(false);
      setLoading(false);
    } else {
      console.log("Ошибка, попробуйте обновить страницу");
      setLoading(false);
    }
  };

  // The middle cell is either simple text or a small form
  const renderName = !isEditMode ? (
    <td>{newName}</td>
  ) : (
    <td>
      <form
        onSubmit={e => {
          e.preventDefault();
          updateName(id, newName);
        }}
      >
        <Input
          type="text"
          value={newName}
          onChange={e => setName(e.target.value)}
          autoFocus
        />
      </form>
    </td>
  );
  const buttonText = isLoading
    ? "Загрузка..."
    : isEditMode
    ? "Отмена"
    : "Изменить";

  return (
    <tr>
      <td>{path}</td>
      {renderName}
      <td>
        <button
          onClick={() => {

            setEditMode(!isEditMode);
          }}
        >
          {buttonText}
        </button>
      </td>
    </tr>
  );
};

const DbSection = () => {
  const [names, setNames] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const res = await axios.get(API_URL);
    setNames(res.data);
  };

  return (
    <Wrapper>
      <h1>Настройки имен</h1>
      <Table>
        <TableHead>
          <tr>
            <th>Папка</th>
            <th>Имя</th>
            <th>Изменить</th>
          </tr>
        </TableHead>
        <tbody>
          {names.map(n => (
            <EditableRow
              key={n.id}
              id={n.id}
              path={n.path}
              name={n.name}
            />
          ))}
        </tbody>
      </Table>
    </Wrapper>
  );
};

export default DbSection;

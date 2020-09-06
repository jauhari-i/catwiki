const router = require('express').Router();
const axios = require('axios');
const Cats = require('../models/Cats');
const apiKey = process.env.CAT_API;
const baseUrl = 'https://api.thecatapi.com/v1';
const config = {
  headers: {
    'x-api-key': apiKey,
  },
};

router.get('/', (req, res) => {
  res.send('Hello world');
});

router.get('/breeds', async (req, res) => {
  const data = await axios.get(`${baseUrl}/breeds`, config);
  if (!data.data) {
    res.status(500).json({
      message: 'Failed to fetch data, internal server error',
    });
  }
  const breedName = data.data.map((d) => ({
    id: d.id,
    name: d.name,
  }));

  res.status(200).json({
    data: breedName,
    message: 'Get breed success',
  });
});

router.get('/breeds/:name', async (req, res) => {
  const name = req.params.name;
  const data = await axios.get(`${baseUrl}/breeds/${name}`, config);
  const dataImg = await axios.get(`${baseUrl}/images/search?breed_id=${name}`, config);
  if (!data.data) {
    res.status(500).json({
      message: 'Failed to fetch data, internal server error',
    });
  }
  const img = dataImg.data[0].url;
  const catNow = await Cats.findOne({ catId: name });
  const updatePop = await Cats.updateOne({ catId: name }, { search: catNow.search + 1 });
  const dataBreed = data.data;
  res.status(200).json({
    data: { breed: dataBreed, img },
    message: 'Get breed success',
    updated: updatePop.ok,
  });
});

router.get('/cat', async (req, res) => {
  try {
    const data = await axios.get(`${baseUrl}/breeds`, config);
    if (!data.data) {
      res.status(500).json({
        message: 'Failed to fetch data, internal server error',
      });
    }
    const breedData = data.data;
    const popularity = await Cats.find();
    const catData = popularity.map((p) => ({
      id: p.catId,
      search: p.search,
    }));
    const breedPopularity = breedData.map((item, idx) => Object.assign({}, item, catData[idx]));
    const sortedBreed = breedPopularity.sort((a, b) => parseFloat(b.search) - parseFloat(a.search));
    res.status(200).json({
      data: sortedBreed,
      message: 'Get breed popluarity success',
    });
  } catch (error) {
    res.status(500).json({
      error,
      message: 'Internal server error',
    });
  }
});

router.get('/images/:name/:limit', async (req, res) => {
  const name = req.params.name;
  const limit = req.params.limit;
  const data = await axios.get(`${baseUrl}/images/search?breed_id=${name}&limit=${limit}`, config);
  if (!data.data) {
    res.status(500).json({
      message: 'Failed to fetch data, internal server error',
    });
  }
  res.status(200).json({
    data: data.data,
    message: 'Get breed image success',
  });
});

module.exports = router;

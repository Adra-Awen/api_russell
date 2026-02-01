const Catway = require('../models/catway');

/**
 * Liste des catways
 * @route GET /catways
 */

exports.getAllCatways = async (req, res) => {
    try {
        const catways = await Catway.find();
        return res.status(200).json(catways);
    } catch (error) {
        return res.status(500).json(error);
    }
};

/**
 * @route GET /catways/:id
 */

exports.getCatwayById = async (req, res) => {
    const id = Number(req.params.id);

    try {
        const catway = await Catway.findOne({catwayNumber: id});

        if (!catway) {
            return res.status(404).json({message: 'catway_not_found'});
        }
        return res.status(200).json(catway);
    } catch (error) {
        return res.status(500).json(error);
    }
};

/** 
 * @route POST /catways 
 */

exports.createCatway = async (req, res) => {
    const { catwayNumber, catwayType, catwayState } = req.body;

    try {
        const existing = await Catway.findOne ({catwayNumber});

        if (existing) {
            return res.status(409).json({message: 'catway_already_exists'});
        }

        const catway = new Catway({
            catwayNumber,
            catwayType,
            catwayState
        });

        await catway.save();

        return res.status(201).json(catway);
    } catch (error) {
        return res.status(500).json(error);
    }
};

/**
 * @route PUT /catways/:id
 */

exports.updateCatway = async (req, res) => {
    const id = Number(req.params.id);
    const {catwayState} = req.body;

    try {
        const catway = await Catway.findOne({ catwayNumber: id });

        if (!catway) {
      return res.status(404).json({ message: 'catway_not_found' });
    }

        if (catwayState) {
      catway.catwayState = catwayState;
    }

        await catway.save();

        return res.status(200).json(catway);
  } catch (error) {
    return res.status(500).json(error);
  }
};

/**
 * @route DELETE /catways/:id
 */

// DELETE /catways/:id
exports.deleteCatway = async (req, res) => {
    const id = Number(req.params.id);

    try {
        const catway = await Catway.findOneAndDelete({ catwayNumber: id });

        if (!catway) {
            return res.status(404).json({ message: 'catway_not_found' });
        }

        return res.status(200).json({ message: 'catway_deleted' });
    } catch (error) {
        return res.status(500).json(error);
    }
};

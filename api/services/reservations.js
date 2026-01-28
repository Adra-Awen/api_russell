const Reservation = require('../models/reservation');

/**
 * Liste de résa pour un catway
 * @route GET /catways/:id/reservations
 */

exports.getReservationsByCatway = async (req, res) => {
    const id = Number(req.params.id);

    try {
        const reservations = await Reservation.find({ catwayNumber: id});
        return res.status(200).json(reservations);
    } catch (error) {
        return res.status(500).json(error);
    }
};

/**
 * Récupérer une résa précise pour un catway
 * @route GET /catways/:id/reservations/:idReservation
 */

exports.getReservationById = async (req, res) => {
    const catwayId = Number(req.params.id);
    const reservationId = req.params.idReservation;

    try {
        const reservation = await Reservation.findOne({
            _id: reservationId,
            catwayNumber: catwayId
        });

        if(!reservation) {
            return res.status(404).json({message: 'reservation_not_found'});
        }

        return res.status(200).json(reservation);
    } catch (error) {
        return res.status(500).json(error);
    }
};

/**
 * Créer une résa
 * @route POST /catways/:id/reservations
 */

exports.createReservation = async (req, res) => {
    const catwayId = Number(req.params.id);
    const { clientName, boatName, startDate, endDate } = req.body;

    try {
        if (!clientName || !boatName || !startDate || !endDate) {
            return res.status(400).json({message: 'missing_fields' });
        }

        const start = new Date(startDate);
        const end = new Date(endDate);

        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            return res.status(400).json({message: 'invalid_dates' });
        }

        if (start > end) {
            return res.status(400).json({message: 'start_after_end'});
        }

        const reservation = new Reservation ({
            catwayNumber: catwayId,
            clientName,
            boatName,
            startDate: start,
            endDate: end
        });

        await reservation.save();

        return res.status(201).json(reservation);
    } catch (error) {
        return res.status(500).json(error);
    }
};

/**
 * Modifier une résa
 * @route PUT /catways/:id/reservations/:idReservation
 */

exports.updateReservation = async (req, res) => {
    const catwayId = Number(req.params.id);
    const reservationId = req.params.idReservation;
    const { clientName, boatName, startDate, endDate } = req.body;

    try {
        const reservation = await Reservation.findOne({
            _id: reservationId,
            catwayNumber: catwayId
        });

        if (!reservation) {
            return res.status(404).json({ message: 'reservation_not_found'});
        }

        if (startDate) {
            const start = new Date(startDate);
            if (isNaN(start.getTime())) {
                return res.status(400).json({ message: 'invalid_startDate'});
            }
            reservation.startDate = start;
        }

        if (endDate) {
            const end = new Date(endDate);
            if (isNaN(end.getTime())) {
                return res.status(400).json({ message: 'invalid_endDate'});
            }
            reservation.endDate = end;
        }

        if (reservation.startDate > reservation.endDate) {
            return res.status(400).json({ message: 'start_after_end'});
        }

        await reservation.save();

        return res.status(200).json(reservation);
    } catch (error) {
        return res.status(500).json(error);
    }
};

/**
 * Supprimer une résa
 * @route PUT /catways/:id/reservations/:idReservation
 */

exports.deleteReservation = async (req, res) => {
    const catwayId = Number(req.params.id);
    const reservationId = req.params.idReservation;

    try{
        const reservation = await Reservation.findOneAndDelete({
            _id: reservationId,
            catwayNumber: catwayId
        });

        if(!reservation) {
            return res.status(404).json({ message: 'reservation_not_found'});
        }

        return res.status(200).json({ message: 'reservation_deleted'});
    } catch (error) {
        return res.status(500).json(error);
    }
};
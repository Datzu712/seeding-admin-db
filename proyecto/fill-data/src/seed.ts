import './instrumentation';
import { faker } from '@faker-js/faker/locale/es';
import {
    sequelize,
    Facility,
    Area,
    Doctor,
    DoctorFacility,
    Room,
    Patient,
    Appointment,
    AppUser,
    FacilityCreationAttributes,
    AreaCreationAttributes,
    DoctorFacilityCreationAttributes,
    RoomCreationAttributes,
    PatientCreationAttributes,
    AppointmentCreationAttributes,
    AppUserCreationAttributes,
} from '@/db/models/models';

import { hospitals } from '@/assets/hospitals';
import { areas } from '@/assets/areas';

async function seedFacilities() {
    const count = faker.number.int({ min: 50, max: 150 });
    const facilities: FacilityCreationAttributes[] = [];

    const cloned_hospitals = faker.helpers.shuffle(hospitals);

    for (let i = 0; i < count; i++) {
        facilities.push({
            NAME: cloned_hospitals.pop()! || `Hospital ${i + 1}`,
            DESCRIPTION: faker.company.catchPhrase(),
        });
    }
    await Facility.bulkCreate(facilities);
    console.log(`Seeded ${count} facilities.`);
}

async function seedAreas() {
    const facilityIds = (await Facility.findAll({ attributes: ['ID'] })).map((f) => f.ID);
    const count = faker.number.int({ min: 50, max: 150 });
    const newAreas: AreaCreationAttributes[] = [];

    for (let i = 0; i < count; i++) {
        const facilityId = faker.helpers.arrayElement(facilityIds);

        let newAreaName = faker.helpers.arrayElement(areas);
        if (newAreas.some((area) => area.NAME === newAreaName && area.FACILITY_ID === facilityId)) {
            // Ensure unique area names per facility
            newAreaName += `-${faker.string.uuid()}`;
        }

        newAreas.push({
            FACILITY_ID: faker.helpers.arrayElement(facilityIds),
            DESCRIPTION: faker.lorem.sentence(),
            CREATED_AT: faker.date.past(),
            NAME: newAreaName,
        });
    }
    await Area.bulkCreate(newAreas);
    console.log(`Seeded ${count} areas.`);
}

async function seedDoctors() {
    const count = faker.number.int({ min: 50, max: 150 });
    const doctors = [];
    for (let i = 0; i < count; i++) {
        doctors.push({
            FIRST_NAME: faker.person.firstName(),
            LAST_NAME: faker.person.lastName(),
            PHONE: faker.phone.number(),
            EMAIL: faker.internet.email(),
            CREATED_AT: faker.date.past(),
        });
    }
    await Doctor.bulkCreate(doctors);
    console.log(`Seeded ${count} doctors.`);
}

async function seedDoctorFacilities() {
    const doctorIds = (await Doctor.findAll({ attributes: ['ID'] })).map((d) => d.ID);
    const areaIds = (await Area.findAll({ attributes: ['ID'] })).map((a) => a.ID);
    const count = faker.number.int({ min: 50, max: 150 });
    const links: DoctorFacilityCreationAttributes[] = [];
    for (let i = 0; i < count; i++) {
        links.push({
            DOCTOR_ID: faker.helpers.arrayElement(doctorIds),
            AREA_ID: faker.helpers.arrayElement(areaIds),
        });
    }
    await DoctorFacility.bulkCreate(links);
    console.log(`Seeded ${count} doctor-area links.`);
}

async function seedRooms() {
    const areaIds = (await Area.findAll({ attributes: ['ID'] })).map((a) => a.ID);
    const count = faker.number.int({ min: 50, max: 150 });
    const rooms: RoomCreationAttributes[] = [];

    for (let i = 0; i < count; i++) {
        rooms.push({
            AREA_ID: faker.helpers.arrayElement(areaIds),
            NAME: `Room ${i}`,
            DESCRIPTION: faker.commerce.productDescription(),
            CREATED_AT: faker.date.past(),
        });
    }
    await Room.bulkCreate(rooms);
    console.log(`Seeded ${count} rooms.`);
}

async function seedPatients() {
    const count = faker.number.int({ min: 50, max: 150 });
    const patients: PatientCreationAttributes[] = [];
    for (let i = 0; i < count; i++) {
        patients.push({
            FIRST_NAME: faker.person.firstName(),
            LAST_NAME: faker.person.lastName(),
            DATE_OF_BIRTH: faker.date.birthdate({ min: 18, max: 90, mode: 'age' }),
            GENDER: faker.number.int({ min: 0, max: 1 }),
            PHONE: faker.phone.number(),
            EMAIL: faker.internet.email(),
            ADDRESS: faker.location.streetAddress(),
            CREATED_AT: faker.date.past(),
        });
    }
    await Patient.bulkCreate(patients);
    console.log(`Seeded ${count} patients.`);
}

async function seedAppointments() {
    const patientIds = (await Patient.findAll({ attributes: ['ID'] })).map((p) => p.ID);
    const doctorIds = (await Doctor.findAll({ attributes: ['ID'] })).map((d) => d.ID);
    const roomIds = (await Room.findAll({ attributes: ['ID'] })).map((r) => r.ID);
    const count = faker.number.int({ min: 50, max: 150 });
    const appointments: AppointmentCreationAttributes[] = [];

    for (let i = 0; i < count; i++) {
        const start = faker.date.between({ from: new Date('2024-03-15'), to: new Date('2026-01-01') });
        const end = new Date(start.getTime() + faker.number.int({ min: 15, max: 120 }) * 60000);
        appointments.push({
            PATIENT_ID: faker.helpers.arrayElement(patientIds),
            DOCTOR_ID: faker.helpers.arrayElement(doctorIds),
            ROOM_ID: faker.helpers.arrayElement(roomIds),
            START_TIME: start,
            END_TIME: end,
            STATUS: faker.helpers.arrayElement(['scheduled', 'completed', 'cancelled']),
            DESCRIPTION: faker.lorem.sentence(),
        });
    }
    await Appointment.bulkCreate(appointments);
    console.log(`Seeded ${count} appointments.`);
}

async function seedAppUsers() {
    const count = faker.number.int({ min: 50, max: 150 });
    const users: AppUserCreationAttributes[] = [];
    for (let i = 0; i < count; i++) {
        users.push({
            USERNAME: faker.internet.userName(),
            EMAIL: faker.internet.email(),
            PASSWORD_HASH: faker.internet.password(),
            ROLE: faker.helpers.arrayElement(['admin', 'receptionist', 'doctor']),
            IS_ACTIVE: faker.datatype.boolean(),
            CREATED_AT: faker.date.past(),
        });
    }
    await AppUser.bulkCreate(users);
    console.log(`Seeded ${count} app users.`);
}

async function runSeed() {
    try {
        await sequelize.authenticate();

        console.log('Database connection established successfully.');

        await seedFacilities();
        await seedAreas();
        await seedDoctors();
        await seedDoctorFacilities();
        await seedRooms();
        await seedPatients();
        await seedAppointments();
        await seedAppUsers();
        console.log('All data seeded successfully.');
    } catch (err) {
        console.error('Seeding error:', err);
    } finally {
        await sequelize.close();
    }
}
runSeed();

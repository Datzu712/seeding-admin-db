import { Sequelize, DataTypes, Model, Optional } from 'sequelize';

// Definición de interfaces para Facility
interface FacilityAttributes {
    ID: number;
    NAME: string;
    DESCRIPTION: string;
    CREATED_AT: Date;
    UPDATED_AT?: Date;
    DELETED_AT?: Date;
}

interface FacilityCreationAttributes extends Optional<FacilityAttributes, 'ID' | 'CREATED_AT'> {}

class Facility extends Model<FacilityAttributes, FacilityCreationAttributes> implements FacilityAttributes {
    declare ID: number;
    declare NAME: string;
    declare DESCRIPTION: string;
    declare CREATED_AT: Date;
    declare UPDATED_AT?: Date;
    declare DELETED_AT?: Date;
}

// Definición de interfaces para Area
interface AreaAttributes {
    ID: number;
    FACILITY_ID: number;
    NAME: string;
    DESCRIPTION: string;
    CREATED_AT: Date;
    UPDATED_AT?: Date;
    DELETED_AT?: Date;
}

interface AreaCreationAttributes extends Optional<AreaAttributes, 'ID' | 'CREATED_AT'> {}

class Area extends Model<AreaAttributes, AreaCreationAttributes> implements AreaAttributes {
    declare ID: number;
    declare FACILITY_ID: number;
    declare NAME: string;
    declare DESCRIPTION: string;
    declare CREATED_AT: Date;
    declare UPDATED_AT?: Date;
    declare DELETED_AT?: Date;
}

// Definición de interfaces para Doctor
interface DoctorAttributes {
    ID: number;
    FIRST_NAME: string;
    LAST_NAME: string;
    PHONE?: string;
    EMAIL: string;
    CREATED_AT: Date;
    UPDATED_AT?: Date;
    DELETED_AT?: Date;
}

interface DoctorCreationAttributes extends Optional<DoctorAttributes, 'ID' | 'CREATED_AT'> {}

class Doctor extends Model<DoctorAttributes, DoctorCreationAttributes> implements DoctorAttributes {
    declare ID: number;
    declare FIRST_NAME: string;
    declare LAST_NAME: string;
    declare PHONE?: string;
    declare EMAIL: string;
    declare CREATED_AT: Date;
    declare UPDATED_AT?: Date;
    declare DELETED_AT?: Date;
}

// Definición de interfaces para DoctorFacility (tabla de unión)
interface DoctorFacilityAttributes {
    AREA_ID: number;
    DOCTOR_ID: number;
}

interface DoctorFacilityCreationAttributes extends DoctorFacilityAttributes {}

class DoctorFacility
    extends Model<DoctorFacilityAttributes, DoctorFacilityCreationAttributes>
    implements DoctorFacilityAttributes
{
    declare AREA_ID: number;
    declare DOCTOR_ID: number;
}

// Definición de interfaces para Room
interface RoomAttributes {
    ID: number;
    AREA_ID: number;
    NAME: string;
    DESCRIPTION?: string;
    CREATED_AT: Date;
    DELETED_AT?: Date;
}

interface RoomCreationAttributes extends Optional<RoomAttributes, 'ID' | 'CREATED_AT'> {}

class Room extends Model<RoomAttributes, RoomCreationAttributes> implements RoomAttributes {
    declare ID: number;
    declare AREA_ID: number;
    declare NAME: string;
    declare DESCRIPTION?: string;
    declare CREATED_AT: Date;
    declare DELETED_AT?: Date;
}

// Definición de interfaces para Patient
interface PatientAttributes {
    ID: number;
    FIRST_NAME: string;
    LAST_NAME: string;
    DATE_OF_BIRTH: Date;
    GENDER: number;
    PHONE?: string;
    EMAIL: string;
    ADDRESS?: string;
    CREATED_AT: Date;
    UPDATED_AT?: Date;
    DELETED_AT?: Date;
}

interface PatientCreationAttributes extends Optional<PatientAttributes, 'ID' | 'CREATED_AT'> {}

class Patient extends Model<PatientAttributes, PatientCreationAttributes> implements PatientAttributes {
    declare ID: number;
    declare FIRST_NAME: string;
    declare LAST_NAME: string;
    declare DATE_OF_BIRTH: Date;
    declare GENDER: number;
    declare PHONE?: string;
    declare EMAIL: string;
    declare ADDRESS?: string;
    declare CREATED_AT: Date;
    declare UPDATED_AT?: Date;
    declare DELETED_AT?: Date;
}

// Definición de interfaces para Appointment
interface AppointmentAttributes {
    ID: number;
    PATIENT_ID: number;
    DOCTOR_ID: number;
    ROOM_ID: number;
    START_TIME: Date;
    END_TIME: Date;
    STATUS: string;
    DESCRIPTION?: string;
}

interface AppointmentCreationAttributes extends Optional<AppointmentAttributes, 'ID'> {}

class Appointment extends Model<AppointmentAttributes, AppointmentCreationAttributes> implements AppointmentAttributes {
    declare ID: number;
    declare PATIENT_ID: number;
    declare DOCTOR_ID: number;
    declare ROOM_ID: number;
    declare START_TIME: Date;
    declare END_TIME: Date;
    declare STATUS: string;
    declare DESCRIPTION?: string;
}

// Definición de interfaces para AppUser
interface AppUserAttributes {
    ID: number;
    USERNAME: string;
    EMAIL: string;
    PASSWORD_HASH: string;
    ROLE?: 'admin' | 'receptionist' | 'doctor';
    IS_ACTIVE: boolean;
    CREATED_AT: Date;
    UPDATED_AT?: Date;
    DELETED_AT?: Date;
}

interface AppUserCreationAttributes extends Optional<AppUserAttributes, 'ID' | 'IS_ACTIVE' | 'CREATED_AT'> {}

class AppUser extends Model<AppUserAttributes, AppUserCreationAttributes> implements AppUserAttributes {
    declare ID: number;
    declare USERNAME: string;
    declare EMAIL: string;
    declare PASSWORD_HASH: string;
    declare ROLE?: 'admin' | 'receptionist' | 'doctor';
    declare IS_ACTIVE: boolean;
    declare CREATED_AT: Date;
    declare UPDATED_AT?: Date;
    declare DELETED_AT?: Date;
}

const sequelize = new Sequelize(process.env.ORACLE_CONNECT_STRING, {
    dialect: 'oracle',
    logging: false,
});

Facility.init(
    {
        ID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            field: 'ID',
        },
        NAME: {
            type: DataTypes.STRING(100), // VARCHAR2(100) → STRING(100)
            allowNull: false,
            field: 'NAME',
        },
        DESCRIPTION: {
            type: DataTypes.STRING(320), // VARCHAR2(320) → STRING(320)
            allowNull: false,
            field: 'DESCRIPTION',
        },
        CREATED_AT: {
            type: DataTypes.DATE, // TIMESTAMP(6) → DATE
            defaultValue: DataTypes.NOW,
            field: 'CREATED_AT',
        },
        UPDATED_AT: {
            type: DataTypes.DATE,
            field: 'UPDATED_AT',
        },
        DELETED_AT: {
            type: DataTypes.DATE,
            field: 'DELETED_AT',
        },
    },
    {
        tableName: 'FACILITY',
        sequelize,
        timestamps: false,
    },
);

Area.init(
    {
        ID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            field: 'ID',
        },
        FACILITY_ID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model: Facility, key: 'ID' },
            field: 'FACILITY_ID',
        },
        NAME: { type: DataTypes.STRING(100), allowNull: false, field: 'NAME' },
        DESCRIPTION: { type: DataTypes.STRING(320), allowNull: false, field: 'DESCRIPTION' },
        CREATED_AT: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, field: 'CREATED_AT' },
        UPDATED_AT: { type: DataTypes.DATE, field: 'UPDATED_AT' },
        DELETED_AT: { type: DataTypes.DATE, field: 'DELETED_AT' },
    },
    {
        tableName: 'AREA',
        sequelize,
        timestamps: false,
    },
);

// Modelo Doctor
Doctor.init(
    {
        ID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, field: 'ID' },
        FIRST_NAME: { type: DataTypes.STRING(100), allowNull: false, field: 'FIRST_NAME' },
        LAST_NAME: { type: DataTypes.STRING(100), allowNull: false, field: 'LAST_NAME' },
        PHONE: { type: DataTypes.STRING(20), field: 'PHONE' },
        EMAIL: { type: DataTypes.STRING(200), allowNull: false, field: 'EMAIL' },
        CREATED_AT: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, field: 'CREATED_AT' },
        UPDATED_AT: { type: DataTypes.DATE, field: 'UPDATED_AT' },
        DELETED_AT: { type: DataTypes.DATE, field: 'DELETED_AT' },
    },
    {
        tableName: 'DOCTOR',
        sequelize,
        timestamps: false,
    },
);

// Join Table DoctorFacility
DoctorFacility.init(
    {
        AREA_ID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            references: { model: Area, key: 'ID' },
            field: 'AREA_ID',
        },
        DOCTOR_ID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            references: { model: Doctor, key: 'ID' },
            field: 'DOCTOR_ID',
        },
    },
    {
        tableName: 'DOCTOR_FACILITY',
        sequelize,
        timestamps: false,
    },
);

Room.init(
    {
        ID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, field: 'ID' },
        AREA_ID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model: Area, key: 'ID' },
            field: 'AREA_ID',
        },
        NAME: { type: DataTypes.STRING(200), allowNull: false, unique: true, field: 'NAME' },
        DESCRIPTION: { type: DataTypes.STRING(300), field: 'DESCRIPTION' },
        CREATED_AT: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, field: 'CREATED_AT' },
        DELETED_AT: { type: DataTypes.DATE, field: 'DELETED_AT' },
    },
    {
        tableName: 'ROOM',
        sequelize,
        timestamps: false,
    },
);

Patient.init(
    {
        ID: { type: DataTypes.INTEGER, primaryKey: true, allowNull: false, field: 'ID', autoIncrement: true },
        FIRST_NAME: { type: DataTypes.STRING(100), allowNull: false, field: 'FIRST_NAME' },
        LAST_NAME: { type: DataTypes.STRING(100), allowNull: false, field: 'LAST_NAME' },
        DATE_OF_BIRTH: { type: DataTypes.DATEONLY, allowNull: false, field: 'DATE_OF_BIRTH' },
        GENDER: { type: DataTypes.INTEGER, allowNull: false, field: 'GENDER' }, // NUMBER(1) → INTEGER
        PHONE: { type: DataTypes.STRING(50), field: 'PHONE' },
        EMAIL: { type: DataTypes.STRING(150), allowNull: false, field: 'EMAIL' },
        ADDRESS: { type: DataTypes.STRING(250), field: 'ADDRESS' },
        CREATED_AT: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, field: 'CREATED_AT' },
        UPDATED_AT: { type: DataTypes.DATE, field: 'UPDATED_AT' },
        DELETED_AT: { type: DataTypes.DATE, field: 'DELETED_AT' },
    },
    {
        tableName: 'PATIENT',
        sequelize,
        timestamps: false,
    },
);

Appointment.init(
    {
        ID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, field: 'ID' },
        PATIENT_ID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model: Patient, key: 'ID' },
            field: 'PATIENT_ID',
        },
        DOCTOR_ID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model: Doctor, key: 'ID' },
            field: 'DOCTOR_ID',
        },
        ROOM_ID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model: Room, key: 'ID' },
            field: 'ROOM_ID',
        },
        START_TIME: { type: DataTypes.DATE, allowNull: false, field: 'START_TIME' },
        END_TIME: { type: DataTypes.DATE, allowNull: false, field: 'END_TIME' },
        STATUS: { type: DataTypes.STRING(20), allowNull: false, defaultValue: 'scheduled', field: 'STATUS' },
        DESCRIPTION: { type: DataTypes.STRING(500), field: 'DESCRIPTION' },
    },
    {
        tableName: 'APPOINTMENT',
        sequelize,
        timestamps: false,
    },
);

AppUser.init(
    {
        ID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, field: 'ID' },
        USERNAME: { type: DataTypes.STRING(50), allowNull: false, field: 'USERNAME' },
        EMAIL: { type: DataTypes.STRING(100), allowNull: false, field: 'EMAIL' },
        PASSWORD_HASH: { type: DataTypes.STRING(100), allowNull: false, field: 'PASSWORD_HASH' },
        ROLE: { type: DataTypes.STRING(20), field: 'ROLE', validate: { isIn: [['admin', 'receptionist', 'doctor']] } },
        IS_ACTIVE: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false, field: 'IS_ACTIVE' },
        CREATED_AT: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, field: 'CREATED_AT' },
        UPDATED_AT: { type: DataTypes.DATE, field: 'UPDATED_AT' },
        DELETED_AT: { type: DataTypes.DATE, field: 'DELETED_AT' },
    },
    {
        tableName: 'APP_USER',
        sequelize,
        timestamps: false,
    },
);

// Asociaciones
Facility.hasMany(Area, { foreignKey: 'FACILITY_ID' }); // One-to-Many: Facility → Area
Area.belongsTo(Facility, { foreignKey: 'FACILITY_ID' });

Area.hasMany(Room, { foreignKey: 'AREA_ID' });
Room.belongsTo(Area, { foreignKey: 'AREA_ID' }); // One-to-Many: Area → Room

Doctor.belongsToMany(Area, { through: DoctorFacility, foreignKey: 'DOCTOR_ID', otherKey: 'AREA_ID' }); // Many-to-Many Doctor ↔ Area
Area.belongsToMany(Doctor, { through: DoctorFacility, foreignKey: 'AREA_ID', otherKey: 'DOCTOR_ID' });

Patient.hasMany(Appointment, { foreignKey: 'PATIENT_ID' });
Appointment.belongsTo(Patient, { foreignKey: 'PATIENT_ID' }); // One-to-Many: Patient → Appointment

Doctor.hasMany(Appointment, { foreignKey: 'DOCTOR_ID' });
Appointment.belongsTo(Doctor, { foreignKey: 'DOCTOR_ID' }); // One-to-Many: Doctor → Appointment

Room.hasMany(Appointment, { foreignKey: 'ROOM_ID' });
Appointment.belongsTo(Room, { foreignKey: 'ROOM_ID' }); // One-to-Many: Room → Appointment

// Exportando los modelos
export { sequelize, Facility, Area, Doctor, DoctorFacility, Room, Patient, Appointment, AppUser };

// Exportando los tipos para un mejor soporte de TypeScript
export type {
    FacilityAttributes,
    FacilityCreationAttributes,
    AreaAttributes,
    AreaCreationAttributes,
    DoctorAttributes,
    DoctorCreationAttributes,
    DoctorFacilityAttributes,
    DoctorFacilityCreationAttributes,
    RoomAttributes,
    RoomCreationAttributes,
    PatientAttributes,
    PatientCreationAttributes,
    AppointmentAttributes,
    AppointmentCreationAttributes,
    AppUserAttributes,
    AppUserCreationAttributes,
};

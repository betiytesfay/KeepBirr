import { db } from '../db/index.js';
import { users } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import { hashPassword, comparePassword, generateToken } from '../services/authService.js';
export const register = async (req, res) => {
  try {
    const { name, phoneNumber, email, password } = req.body;
    if (!name || !phoneNumber || !password) {
      return res.status(400).json({ success: false, error: " please fill name and phoneNumber" })
    }
    const existingUser = await db.select().from(users).where(eq(users.phoneNumber, phoneNumber))
    if (existingUser.length > 0) {
      return res.status(400).json({ success: false, error: "Phone number already exists" })


    }

    if (email) {
      const existingEmail = await db.select().from(users).where(eq(users.email, email));
      if (existingEmail.length > 0) {
        return res.status(400).json({ success: false, error: "Email already registered" });
      }
    }
    const hashedPassword = await hashPassword(password);
    const newUser = await db.insert(users).values({
      name,
      email: email || null,
      password_hash: hashedPassword,
      phoneNumber
    }).returning()
    const token = generateToken(newUser[0].id, newUser[0].phoneNumber)
    res.status(201).json({
      success: true,
      data: {
        user: { id: newUser[0].id, name: newUser[0].name, phoneNumber: newUser[0].phoneNumber },
        token,
      }
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      success: false,
      error: "server error"
    })
  }
}
export const login = async (req, res) => {
  try {
    const { phoneNumber, password } = req.body;
    if (!phoneNumber || !password) {
      return res.status(400).json({
        success: false,
        error: "please enter phone number and password"
      })
    }
    const foundUser = await db.select().from(users).where(eq(users.phoneNumber, phoneNumber))
    if (foundUser.length === 0) {
      return res.status(401).json({
        success: false,
        error: "invalid credentials"
      })
    }
    const user = foundUser[0]
    const isMatch = await comparePassword(password, user.password_hash)
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: "Invalid credentials"
      })
    }
    const token = generateToken(user.id, user.phoneNumber);
    res.json({
      success: true,
      data: {
        user: { id: user.id, name: user.name, email: user.email, phoneNumber: user.phoneNumber },
        token,
      },
    });

  } catch (error) {
    console.error(error)

    res.status(500).json({ success: false, error: "Server error" });

  }
}
package com.example.databuilding;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@RunWith(SpringRunner.class)
@WebMvcTest(Application.class)
public class MinimumSpringBootJbossApplicationTests {

	@Autowired
	private MockMvc http;

	@Test
	public void testIndex() throws Exception {
		http.perform(MockMvcRequestBuilders
			.get("/")
		)
		.andDo(print())
		.andExpect(status().isOk())
		.andExpect(content().string("Greetings from Spring Boot and JBoss!"));
	}



}

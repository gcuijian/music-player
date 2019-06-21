package com.createdpro.service;

import com.createdpro.vo.JsonResult;
import com.createdpro.vo.PathConf;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.*;

@Service
public class MusicService {

    @Autowired
    private PathConf pathConf;

    /**
     * 只是测试用啦~不要方
     * @param name
     * @return
     */
    public byte[] getMusic(String name) {
        String MUSIC_PATH = pathConf.getConf().getMUSIC_PATH();
        File music = new File(MUSIC_PATH, name);
        if (!music.exists()) {
            return null;
        }
        byte[] buffer = null;
        try {
            ByteArrayOutputStream output = new ByteArrayOutputStream();
            FileInputStream input = new FileInputStream(music);
            byte[] b = new byte[1024];
            int length;
            while ((length = input.read(b)) != -1){
                output.write(b, 0, length);
            }
            buffer = output.toByteArray();
            output.close();
            input.close();
        } catch (IOException e) {
            e.printStackTrace();
        }

        return buffer;
    }



}
